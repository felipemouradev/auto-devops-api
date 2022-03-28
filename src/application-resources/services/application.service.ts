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
            if (application.isFrontend) {
                // s3 things;
                // cloudfront;
                // dns register route53;
                return;
            }
            result = await this.dockerService.exec("aws --version");
            console.log("result: ", result);
            const container = await this.dockerService.putFile("", result.idContainer);
            result = await this.dockerService.exec("ls -la", container);
            console.log("result1: ", result);

            return result;


            const fullEnv = this.envParser.parse(base64.decode(application.envRaw));
            this.kubernetesService.setEnvironments(fullEnv);
            console.log("configMap: ", this.kubernetesService.getConfigMap())
            console.log("getPlainEnvs: ", this.kubernetesService.getPlainEnvs());
            //@TODO update to all environment
            const ssmStoreParameters = await this.awsService.createSSMParameters(application.name, this.kubernetesService.getPlainEnvs());
            console.log("ssmStoreParameters: ", ssmStoreParameters);
            const ecrRepository: any = await this.awsService.createECRRepository(application.name);
            console.log("ecrRepository: ", ecrRepository);
            const values = this.kubernetesService.getValues();
            values.app.image.repository = ecrRepository.repository.repositoryUri;
            this.kubernetesService.setValues(values);
            console.log("deployment: ", this.kubernetesService.getDeployment())
            console.log("configMap: ", this.kubernetesService.getConfigMap())
            return this.kubernetesService.getValues();
        } catch (e) {
            return e;
        }

    }
}
