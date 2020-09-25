import { Module } from '@nestjs/common';
import { ChartService } from './chart.service';

@Module({
  providers: [ChartService]
})
export class ChartModule {}
