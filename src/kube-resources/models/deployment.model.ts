import {IDeployment, IDeploymentSpec} from "../interfaces/deployment.interface";
import {arrayProp, prop} from "@typegoose/typegoose";
import {Containers, KeyValue, Metadata} from "./base.model";
import {BaseModel} from "../../utils/base.model";
import {ApiProperty} from "@nestjs/swagger";

class Selector {
    @ApiProperty()
    @prop({type: () => KeyValue})
    matchLabels: KeyValue
}

class DeploymentMetadata {
    @ApiProperty()
    @prop({type: () => KeyValue})
    annotations?: KeyValue
    @ApiProperty()
    @prop({type: () => KeyValue})
    labels?: KeyValue
}

class ImagePullSecrets {
    @ApiProperty()
    @prop()
    name: string
}

class SpecDeployment {
    @ApiProperty()
    @arrayProp({type: () => ImagePullSecrets})
    imagePullSecrets: [ImagePullSecrets]
    @ApiProperty()
    @prop({type: () => Containers})
    containers: Containers[]
    @ApiProperty()
    @prop({type: () => KeyValue})
    nodeSelector: KeyValue
    @ApiProperty()
    @prop({type: () => KeyValue})
    affinity: KeyValue
    @ApiProperty()
    @arrayProp({type: () => KeyValue})
    tolerations: [KeyValue]
}

class TemplateDeployment {
    @ApiProperty()
    @prop({type: () => DeploymentMetadata, _id: false})
    metadata: DeploymentMetadata
    @ApiProperty()
    @prop({type: () => SpecDeployment, _id: false})
    spec: SpecDeployment
}

class DeploymentSpec implements IDeploymentSpec {
    @ApiProperty()
    @prop()
    replicas: number;
    @ApiProperty()
    @prop({type: () => Selector, _id: false})
    selector: Selector;
    @ApiProperty()
    @prop({type: () => TemplateDeployment, _id: false})
    template: TemplateDeployment;
}

export class Deployment extends BaseModel implements IDeployment {
    @ApiProperty()
    @prop({default: 'apps/v1'})
    @ApiProperty()
    apiVersion: string;
    @prop({default: "Deployment"})
    @ApiProperty()
    kind: string;
    @prop({type: () => Metadata, _id: false})
    @ApiProperty()
    metadata: Metadata;
    @ApiProperty()
    @prop({type: () => DeploymentSpec, _id: false})
    spec: DeploymentSpec;
}