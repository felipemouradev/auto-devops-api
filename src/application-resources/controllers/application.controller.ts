import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { Application } from '../models/application.model';
import { ApplicationService } from '../services/application.service';

@ApiTags('Application')
@Controller('application')
export class ApplicationController {
    constructor(private readonly applicationService: ApplicationService) {
    }

    @Get('/')
    async get() {
        return this.applicationService.findAll()
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        const application = await this.applicationService.findById(id);
        application.envRaw = decodeURI(application.envRaw);
        return application;
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() applicationDto: Application) {
        applicationDto.id = id;
        return this.applicationService.update(applicationDto)
    }

    @Put('/:id')
    async remove(@Param('id') id: string) {
        return this.applicationService.deleteById(id)
    }

    @Post('/')
    async save(@Body() applicationDto: Application) {
        return this.applicationService.create(applicationDto)
    }
}
