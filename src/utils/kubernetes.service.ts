import * as YAML from 'yaml'
import * as fs from 'fs'

export class KubernetesService {
    deployment;
    configMap;
    values;
    environments;
    constructor() {
        const fileValues = fs.readFileSync('./files/app-template/values.yaml', 'utf8');
        this.values = fileValues;
        const fileDeployment = fs.readFileSync('./files/app-template/templates/deployment.yaml', 'utf8');
        this.deployment = YAML.parse(fileDeployment, { prettyErrors: true, simpleKeys: true });
        const fileConfigMap = fs.readFileSync('./files/app-template/templates/configMap.yaml', 'utf8');
        this.configMap = YAML.parse(fileConfigMap, { prettyErrors: true, simpleKeys: true });
    }

    setEnvsInConfigMap() {
        this.configMap.data = this.environments.envsObject.reduce((prevItem, currItem) => {
            const [key, value] = [...Object.entries(currItem)[0]];
            return { [key]: value, ...prevItem };
        }, {});
        return this.configMap;
    }

    setOfKeysConfigMapInDeployment() {
        const envArray = this.deployment.spec.template.spec.containers[0].env
        Object.entries(this.configMap.data).map((nodoEnv) => {
            const [key, _] = [...nodoEnv]
            envArray.push({
                name: key,
                valueFrom: {
                    configMapKeyRef: {
                        name: '{{ include "scaffoldhelm.fullname" . }}-{{ .Values.deployConfigs.namespace}}',
                        key: key
                    }
                }
            });
        });
        this.deployment.spec.template.spec.containers[0].env = [...envArray];
        return true;
    }

    setEnvironments(envObject) {
        this.environments = envObject;
        this.setEnvsInConfigMap();
    }

    getValues() {
        return this.values;
    }

    setValues(values) {
        this.values = values;
    }

    getDeployment() {
        return this.deployment;
    }

    getConfigMap() {
        return this.configMap;
    }

    generateFiles() {
        fs.writeFileSync('./files/app-template/templates/configMap_.yaml', YAML.stringify(this.configMap), 'utf8');
        fs.writeFileSync('./files/app-template/templates/deployment_.yaml', YAML.stringify(this.deployment), 'utf8');
        // console.log(JSON.stringify(this.deployment, 0, 2));
        // console.log(JSON.stringify(this.configMap, 0, 2));
    }

}