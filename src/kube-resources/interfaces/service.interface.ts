import {IBaseKind, ProtocolTypes} from "./base.interfaces";

export enum IServiceTypes {
    ClusterIP = "ClusterIP",
    LoadBalancer = "LoadBalancer",
    NodePort = "NodePort"
}

export interface IPortService {
    port: number
    targetPort: number
    protocol: ProtocolTypes
}

export interface IServiceSpec {
    type: IServiceTypes,
    ports: IPortService[],
    selector: { [key: string]: string }
}

export interface IService extends IBaseKind {
    spec: IServiceSpec
}

