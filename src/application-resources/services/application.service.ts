import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from "@typegoose/typegoose";
import { AWSService } from 'src/utils/aws.service';
import { EnvParser } from 'src/utils/envparser.service';
import { KubernetesService } from 'src/utils/kubernetes.service';
import { BaseService } from "../../utils/base.service";
import { Application } from '../models/application.model';
import { Docker } from 'node-docker-api';
import * as base64 from 'base-64';
import { DockerService } from 'src/utils/docker.service';
import * as Shelljs from 'shelljs';
import slugify from 'slugify';
import { GithubService } from 'src/utils/github.service';
import * as uniqid from 'uniqid';

@Injectable()
export class ApplicationService extends BaseService<Application> {
    constructor(
        @InjectModel(Application.modelName)
        protected readonly model: ReturnModelType<typeof Application>,
        private readonly envParser: EnvParser,
        private readonly awsService: AWSService,
        private readonly kubernetesService: KubernetesService,
        private readonly dockerService: DockerService,
        private readonly githubService: GithubService
    ) {
        super(model);
    }

    async generateNewProject(applicationId) {

        try {

            let command = [];
            const application: Application = await this.findById(applicationId);
            const appName = slugify(application.name, { replacement: '-', lower: true, trim: true });
            const basePath = `./files/executions/${appName}-${uniqid()}`;
            const branch = "autodevops-cicd";
            const baseGitRepoPath = `${basePath}/repo/${appName}`
            
            command.push(Shelljs.exec(`mkdir -p ${basePath}`));

            if (application.isFrontend) {
                // s3 things;
                // cloudfront;
                // dns register route53;
                return;
            }

            this.githubService.setAppName(appName);
            this.githubService.setBasePath(baseGitRepoPath);
            this.githubService.clone({
                repoUrl: application.gitUrl,
                user: application.gitUser,
                passwd: application.gitPass,
            });
            this.githubService.newBranch(branch);
            // Adding file into repo 
            command.push(Shelljs.exec(`mkdir -p ${baseGitRepoPath}/.github/workflows`));
            command.push(Shelljs.exec(`cp ./files/cicd/github-actions/backend/build.yaml ${baseGitRepoPath}/.github/workflows/build.yaml`));
            //
            this.githubService.stage(".github/workflows/build.yaml");
            this.githubService.commit("automated commit");
            this.githubService.push(branch);

            command.push(Shelljs.exec(`ls -lah ${basePath}`));
            command.push(Shelljs.exec("aws --version"));
            command.push(Shelljs.exec("helm version"));

            const fullEnv = this.envParser.parse(base64.decode(application.envRaw));
            this.kubernetesService.setAppName(appName);
            this.kubernetesService.setBasePath(basePath);
            this.kubernetesService.setEnvironments(fullEnv);
            console.log("configMap: ", this.kubernetesService.getConfigMap());
            console.log("getPlainEnvs: ", this.kubernetesService.getPlainEnvs());
            //@TODO update to all environment
            // const ssmStoreParameters = await this.awsService.createSSMParameters(application.name, this.kubernetesService.getPlainEnvs());
            // console.log("ssmStoreParameters: ", ssmStoreParameters);
            // const ecrRepository: any = await this.awsService.createECRRepository(application.name);
            // console.log("ecrRepository: ", ecrRepository);
            const values = this.kubernetesService.getValues();
            const repositoryECR = "oci://xxxxxxxx.dkr.ecr.ap-southeast-2.amazonaws.com/";
            // values.app.image.repository = ecrRepository.repository.repositoryUri;
            this.kubernetesService.setValues(values);
            this.kubernetesService.generateFiles();
            command.push(Shelljs.exec(`helm package ${basePath}/${appName} -d ${basePath}`));
            command.push(Shelljs.exec(`helm push ${basePath}/${appName}-${this.kubernetesService.getVersion()}.tgz ${repositoryECR}`));
            command.push(Shelljs.exec(`ls -la ${basePath}`));
            // command.push(Shelljs.exec(`rm ./files/${appName}-*`));
            
            return command;
        } catch (e) {
            return e;
        }

    }
}
