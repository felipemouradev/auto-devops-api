import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from "@typegoose/typegoose";
import { AWSService } from 'src/utils/aws.service';
import { EnvParser } from 'src/utils/envparser.service';
import { KubernetesService } from 'src/utils/kubernetes.service';
import { BaseService } from "../../utils/base.service";
import { Application } from '../models/application.model';

@Injectable()
export class ApplicationService extends BaseService<Application> {
    constructor(
        @InjectModel(Application.modelName)
        protected readonly model: ReturnModelType<typeof Application>,
        private readonly envParser: EnvParser,
        private readonly awsService: AWSService,
        private readonly kubernetesService: KubernetesService
    ) {
        super(model);
    }

    async generateNewProject(applicationId) {
        const application: Application = await this.findById(applicationId);
        if (application.isFrontend) {
            // s3 things;
            // cloudfront;
            // dns register route53;
            return;
        }
        const fullEnv = this.envParser.parse(application.envRaw);
        const ssmStoreParameters = await this.awsService.createSSMParameters(application.name, fullEnv);
        console.log("ssmStoreParameters: ", ssmStoreParameters);
        const ecrRepository: any = await this.awsService.createECRRepository(application.name);
        console.log("ecrRepository: ", ecrRepository);
        const fullRepository = `${ecrRepository.repository.registryId}.dkr.ecr.${application.aws_region}.amazonaws.com/${application.name}`;
        const values = this.kubernetesService.getValues();
        values.app.image.repository = fullRepository;
        this.kubernetesService.setValues(values);
        this.kubernetesService.setEnvironments(fullEnv);
        console.log("deployment: ", this.kubernetesService.getDeployment())
        console.log("configMap: ", this.kubernetesService.getConfigMap())

    }
}
