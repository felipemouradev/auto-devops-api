export interface IBaseKind {
    apiVersion: string,
    kind: string,
    metadata: IMetadata,
    spec?: any
}

export interface IMetadata {
    name: string,
    labels: { [key: string]: string }
}

export interface IPorts {
    name: string,
    containerPort: number,
    protocol: string,
}

export interface IEnvConfigMap {
    name: string,
    valueFrom: {
        configMapKeyRef: {
            name: string
            key: string
        }
    }
}

export interface IContainers {
    name: string,
    image: string,
    env?: IEnvConfigMap[],
    imagePullPolicy?: string,
    resources?: [{ [key: string]: string }],
    ports: IPorts[]
}

export enum ProtocolTypes {
    TCP = "TCP",
    UDP = "UDP"
}