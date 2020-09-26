import {Module} from '@nestjs/common';
import {ChartService} from './services/chart.service';
import {DeploymentService} from './services/deployment.service';
import {ConfigMapService} from './services/config-map.service';
import {ServiceService} from './services/service.service';
import {MongooseModule} from '@nestjs/mongoose';
import {Deployment} from "./models/deployment.model";
import {ConfigMap} from "./models/config-map.model";
import {DeploymentController} from "./controllers/deployment.controller";
import {ConfigMapController} from "./controllers/config-map.controller";
import {ServiceController} from "./controllers/service.controller";


@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Deployment.modelName, schema: Deployment.schema},
        ]),
        MongooseModule.forFeature([
            {name: ConfigMap.modelName, schema: ConfigMap.schema},
        ]),
    ],
    providers: [
        ChartService,
        ServiceService,
        DeploymentService,
        ConfigMapService
    ],
    controllers: [
        DeploymentController,
        ConfigMapController,
        ServiceController
    ]
})
export class KubeResourcesModule {
}
