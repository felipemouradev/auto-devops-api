import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypegooseModule} from 'nestjs-typegoose';
import { ChartModule } from './chart/chart.module';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://localhost:27021/devops-tools'),
    ChartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
