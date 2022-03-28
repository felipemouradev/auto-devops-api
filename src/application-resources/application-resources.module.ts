import { Module } from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Application } from "./models/application.model";
import { ApplicationController } from "./controllers/application.controller";
import { AWSService } from 'src/utils/aws.service';
import { KubernetesService } from 'src/utils/kubernetes.service';
import { EnvParser } from 'src/utils/envparser.service';
import { DockerService } from 'src/utils/docker.service';


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Application.modelName, schema: Application.schema },
        ]),
    ],
    providers: [
        ApplicationService, AWSService, KubernetesService, EnvParser, DockerService,
    ],
    controllers: [
        ApplicationController,
    ]
})
export class ApplicationResources {
}
