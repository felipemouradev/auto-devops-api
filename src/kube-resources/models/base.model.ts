import {IContainers, IEnvConfigMap, IMetadata, IPorts} from "../interfaces/base.interfaces";
import {arrayProp, prop} from '@typegoose/typegoose';

export class KeyValue {
    [key: string]: string
}

export class Metadata implements IMetadata {
    @prop({type: () => KeyValue})
    labels: KeyValue;
    @prop()
    name: string;
}

export class Ports implements IPorts {
    @prop()
    containerPort: number;
    @prop()
    name: string;
    @prop()
    protocol: string;
}


class NameKey {
    name: string;
    key: string
}

class ValueFromConfigMap {
    @prop({type: () => NameKey, _id: false})
    configMapKeyRef: NameKey
}

export class EnvConfigMap implements IEnvConfigMap {
    @prop()
    name: string;
    @prop({type: () => ValueFromConfigMap, _id: false})
    valueFrom: ValueFromConfigMap
}

export class Port implements IPorts {
    @prop()
    containerPort: number;
    @prop()
    name: string;
    @prop()
    protocol: string;
}

export class Containers implements IContainers {
    @arrayProp({type: () => EnvConfigMap, _id: false,})
    env: EnvConfigMap[];
    @prop()
    image: string;
    @prop()
    imagePullPolicy: string;
    @prop()
    name: string;
    @prop({type: () => Port})
    ports: Port[];
    @arrayProp({type: KeyValue})
    resources: [KeyValue];
}