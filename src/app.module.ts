import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationResources } from './application-resources/application-resources.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_STRING_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        ApplicationResources,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
