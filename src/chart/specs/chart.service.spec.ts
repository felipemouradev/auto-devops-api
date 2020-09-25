import {Test, TestingModule} from '@nestjs/testing';
import {ChartService} from '../chart.service';
import {IContainers, IMetadata} from "../interfaces/base.interfaces";
import {IDeployment, IDeploymentSpec} from "../interfaces/deployment.interface";
import * as json2yaml from "json-to-pretty-yaml";
import * as fs from "fs";

describe('ChartService', () => {
    let service: ChartService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ChartService],
        }).compile();

        service = module.get<ChartService>(ChartService);
    });

    it('should be defined', () => {
        const dataContainers: IContainers[] = [{
            image: "nginx:latest",
            name: "app-teste",
            ports: [{
                containerPort: 80,
                name: "port-nginx",
                protocol: "TCP"
            }]
        }]

        const dataDeploymentSpec: IDeploymentSpec = {
            replicas: 1,
            selector: {
                matchLabels: {
                    "app.kubernetes.io/name": dataContainers[0].name,
                    "app.kubernetes.io/instance": dataContainers[0].name
                }
            },
            template: {
                metadata: {
                    annotations: {
                        "traffic.sidecar.istio.io/excludeOutboundIPRanges": "0.0.0.0/0"
                    },
                    labels: {
                        "app.kubernetes.io/name": dataContainers[0].name,
                        "app.kubernetes.io/instance": dataContainers[0].name
                    }
                },
                spec: {
                    containers: dataContainers,
                }
            }
        }

        const dataMetadata: IMetadata = {
            labels: {
                "app.kubernetes.io/name": dataContainers[0].name,
                "app.kubernetes.io/instance": dataContainers[0].name
            },
            name: dataContainers[0].name
        }

        const dataDeployment: IDeployment = {
            apiVersion: "apps/v1",
            kind: "Deployment",
            metadata: dataMetadata,
            spec: dataDeploymentSpec
        }

        fs.writeFileSync(__dirname + '/deployment.yaml', json2yaml.stringify(dataDeployment))
    });
});
