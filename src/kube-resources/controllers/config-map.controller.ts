import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {ConfigMap} from "../models/config-map.model";
import {ConfigMapService} from "../services/config-map.service";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('config-map')
@Controller('config-map')
export class ConfigMapController {
    constructor(private readonly configMapService: ConfigMapService) {
    }

    @Get('/')
    async get() {
        return this.configMapService.findAll()
    }

    @Get('/:id')
    async getOne(@Param('id') id: string) {
        return this.configMapService.findById(id)
    }

    @Put('/:id')
    async update(@Param('id') id: string, @Body() configMapDto: ConfigMap) {
        configMapDto.id = id;
        return this.configMapService.update(configMapDto)
    }

    @Put('/:id')
    async remove(@Param('id') id: string) {
        return this.configMapService.deleteById(id)
    }

    @Post('/')
    async save(@Body() configMapDto: ConfigMap) {
        return this.configMapService.create(configMapDto)
    }
}
