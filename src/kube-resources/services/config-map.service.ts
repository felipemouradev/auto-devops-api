import {Injectable} from '@nestjs/common';
import {BaseService} from "../../utils/base.service";
import {ConfigMap} from "../models/config-map.model";
import {InjectModel} from '@nestjs/mongoose';
import {ReturnModelType} from "@typegoose/typegoose";

@Injectable()
export class ConfigMapService extends BaseService<ConfigMap> {
    constructor(
        @InjectModel(ConfigMap.modelName)
        protected readonly model: ReturnModelType<typeof ConfigMap>,
    ) {
        super(model);
    }
}
