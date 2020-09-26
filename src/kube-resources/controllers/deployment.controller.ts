import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {DeploymentService} from "../services/deployment.service";
import {Deployment} from "../models/deployment.model";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('deployment')
@Controller('deployment')
export class DeploymentController {
    constructor(private readonly deploymentService: DeploymentService) {
    }

    @Get('/')
    async get() {
        return this.deploymentService.findAll()
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return this.deploymentService.findById(id)
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() deploymentDto: Deployment) {
        deploymentDto.id = id;
        return this.deploymentService.update(deploymentDto)
    }

    @Put('/:id')
    async remove(@Param('id') id: string) {
        return this.deploymentService.deleteById(id)
    }

    @Post('/')
    async save(@Body() deploymentDto: Deployment) {
        return this.deploymentService.create(deploymentDto)
    }
}
