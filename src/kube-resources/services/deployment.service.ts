import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Deployment} from "../models/deployment.model";
import {ReturnModelType} from "@typegoose/typegoose";
import {BaseService} from "../../utils/base.service";

@Injectable()
export class DeploymentService extends BaseService<Deployment> {
    constructor(
        @InjectModel(Deployment.modelName)
        protected readonly model: ReturnModelType<typeof Deployment>,
    ) {
        super(model);
    }
}
