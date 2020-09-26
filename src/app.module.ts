import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {KubeResourcesModule} from './kube-resources/kube-resources.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27021/auto-devops', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        KubeResourcesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
