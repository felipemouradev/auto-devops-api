import * as json2yaml from 'js-yaml';
import {Injectable} from '@nestjs/common';
import * as unzip from 'unzip';
import * as fs from 'fs';
import {resolve} from 'path'
import {IContainers, IMetadata, ProtocolTypes} from "../interfaces/base.interfaces";
import {IDeployment, IDeploymentSpec} from "../interfaces/deployment.interface";

@Injectable()
export class ChartService {
    processChart() {
        const defaultPath = resolve(__dirname, 'specs', 'chart', 'values.yaml');
        const values = fs.readFileSync(defaultPath);
        console.log('values: ', json2yaml.load(values))
    }

    getDeployment(): IDeployment {
        const dataContainers: IContainers[] = [{
            image: "",
            name: "",
            ports: [{
                containerPort: 80,
                name: "",
                protocol: ProtocolTypes.TCP
            }]
        }]

        const dataDeploymentSpec: IDeploymentSpec = {
            replicas: 1,
            selector: {
                matchLabels: {
                    "app.kubernetes.io/name": `{{ include "scaffoldhelm.name" . }}`,
                    "app.kubernetes.io/instance": `{{ .Release.Name }}`,
                }
            },
            template: {
                metadata: {
                    annotations: {
                        "traffic.sidecar.istio.io/excludeOutboundIPRanges": "0.0.0.0/0"
                    },
                    labels: {
                        "app.kubernetes.io/name": `{{ include "scaffoldhelm.name" . }}`,
                        "app.kubernetes.io/instance": `{{ .Release.Name }}`,
                    }
                },
                spec: {
                    containers: dataContainers,
                }
            }
        }

        const dataMetadata: IMetadata = {
            labels: {
                "app.kubernetes.io/name": `{{ include "scaffoldhelm.name" . }}`,
                "app.kubernetes.io/instance": `{{ .Release.Name }}`,
                "helm.sh/chart": `{{ include "scaffoldhelm.chart" . }}`,
                "app.kubernetes.io/managed-by": `{{ .Release.Service }}`
            },
            name: ""
        }

        return {
            apiVersion: "apps/v1",
            kind: "Deployment",
            metadata: dataMetadata,
            spec: dataDeploymentSpec
        }
    }
}
