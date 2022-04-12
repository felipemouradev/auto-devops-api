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

@Injectable()
export class ApplicationService extends BaseService<Application> {
    constructor(
        @InjectModel(Application.modelName)
        protected readonly model: ReturnModelType<typeof Application>,
        private readonly envParser: EnvParser,
        private readonly awsService: AWSService,
        private readonly kubernetesService: KubernetesService,
        private readonly dockerService: DockerService
    ) {
        super(model);
    }

    async generateNewProject(applicationId) {

        try {
            let result;
            const application: Application = await this.findById(applicationId);
            const appName = slugify(application.name, {replacement: '-', lower: true, trim: true});
            if (application.isFrontend) {
                // s3 things;
                // cloudfront;
                // dns register route53;
                return;
            }

            let command = [];
            command.push(Shelljs.exec("aws --version"));
            command.push(Shelljs.exec("helm version"));

            const fullEnv = this.envParser.parse(base64.decode(application.envRaw));
            this.kubernetesService.setAppName(appName);
            this.kubernetesService.setEnvironments(fullEnv);
            console.log("configMap: ", this.kubernetesService.getConfigMap())
            console.log("getPlainEnvs: ", this.kubernetesService.getPlainEnvs());
            //@TODO update to all environment
            // const ssmStoreParameters = await this.awsService.createSSMParameters(application.name, this.kubernetesService.getPlainEnvs());
            // console.log("ssmStoreParameters: ", ssmStoreParameters);
            // const ecrRepository: any = await this.awsService.createECRRepository(application.name);
            // console.log("ecrRepository: ", ecrRepository);
            const values = this.kubernetesService.getValues();
            // values.app.image.repository = ecrRepository.repository.repositoryUri;
            this.kubernetesService.setValues(values);
            this.kubernetesService.generateFiles();
            command.push(Shelljs.exec(`helm package ./files/${appName}`));
            command.push(Shelljs.exec(`ls -la ./files/ | grep ${appName}`));
            // command.push(Shelljs.exec(`rm ./files/${appName}-*`));
            return command;
        } catch (e) {
            return e;
        }

    }
}
