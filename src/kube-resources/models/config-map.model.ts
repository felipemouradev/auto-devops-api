import {arrayProp, prop} from '@typegoose/typegoose';
import {IConfigMap} from "../interfaces/configMap.interface";
import {KeyValue, Metadata} from "./base.model";
import {BaseModel} from "../../utils/base.model";
import {ApiProperty} from "@nestjs/swagger";

export class ConfigMap extends BaseModel implements IConfigMap {
    @ApiProperty()
    @prop({default: 'apps/v1'})
    apiVersion: string;
    @ApiProperty()
    @prop({default: 'ConfigMap'})
    kind: string;
    @ApiProperty()
    @prop({type: () => Metadata, _id: false})
    metadata: Metadata;
    @ApiProperty()
    @prop({
            _id: false,
            validate: {
                validator: (v) => typeof v === "object",
                message: "only accept key: value in object"
            },
        }
    )
    data: { [key: string]: string };
}

