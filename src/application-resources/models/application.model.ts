import { IDeployment, IDeploymentSpec } from "../interfaces/deployment.interface";
import { arrayProp, prop } from "@typegoose/typegoose";
import { Containers, KeyValue, Metadata } from "./base.model";
import { BaseModel } from "../../utils/base.model";
import { ApiProperty } from "@nestjs/swagger";

class K8sObjects {
    @prop()
    name: string;
    @prop()
    objectRaw: string;
}

export class Application extends BaseModel {
    @ApiProperty()
    @arrayProp({ require: false, type: () => K8sObjects })
    objects: K8sObjects[]
    @prop()
    @ApiProperty()
    name: string;
    @prop()
    @ApiProperty()
    projectId: string;
    @prop({ default: true })
    @ApiProperty()
    gitRepoExists: Boolean;
    @prop()
    @ApiProperty()
    gitUrl: string;
    @prop()
    @ApiProperty()
    gitUser: string;
    @prop()
    @ApiProperty()
    gitPass: string;
    @prop({ required: false, default: false })
    @ApiProperty()
    isFrontend: Boolean;
    @prop()
    @ApiProperty()
    aws_access_key_id: string;
    @prop()
    @ApiProperty()
    aws_secret_access_key: string;
    @prop()
    @ApiProperty()
    aws_region: string;
    @prop()
    @ApiProperty()
    fullDomain: string;
    @prop({ required: false })
    @ApiProperty()
    envRaw: string;
}