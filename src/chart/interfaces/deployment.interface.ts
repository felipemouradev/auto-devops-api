import {IBaseKind, IContainers} from "./base.interfaces";

export interface IDeployment extends IBaseKind {
    spec: IDeploymentSpec
}

export interface IDeploymentSpec {
    replicas: number,
    selector: {
        matchLabels: { [key: string]: string }
    },
    template: {
        metadata: {
            annotations?: { [key: string]: string },
            labels?: { [key: string]: string },
        }
        spec: {
            imagePullSecrets?: [{ name: string }],
            containers: IContainers[],
            nodeSelector?: [{ [key: string]: string }],
            affinity?: [{ [key: string]: string }],
            tolerations?: [{ [key: string]: string }],
        }
    }
}