import * as YAML from 'yaml'
import * as fs from 'fs'
import * as Shelljs from 'shelljs'

export class KubernetesService {
    deployment;
    configMap;
    values;
    environments;
    appName;
    chart;
    basePath;
    constructor() {
        const fileValues = fs.readFileSync('./files/app-template/values.yaml', 'utf8');
        this.values = YAML.parse(fileValues, { prettyErrors: true, simpleKeys: true });
        const chartValues = fs.readFileSync('./files/app-template/Chart.yaml', 'utf8');
        this.chart = YAML.parse(chartValues, { prettyErrors: true, simpleKeys: true });
        const fileDeployment = fs.readFileSync('./files/app-template/templates/deployment.yaml', 'utf8');
        this.deployment = YAML.parse(fileDeployment, { prettyErrors: true, simpleKeys: true });
        const fileConfigMap = fs.readFileSync('./files/app-template/templates/configMap.yaml', 'utf8');
        this.configMap = YAML.parse(fileConfigMap, { prettyErrors: true, simpleKeys: true });
    }

    setBasePath(basePath: String, ) {
        this.basePath = basePath;
    }
    
    setAppName(name: String, nonSlugfy: String = null) {
        this.appName = name;
        this.chart.name = name;
        this.values.nameOverride = name;
        this.values.fullnameOverride = name;
    }

    setEnvsInConfigMap() {
        console.log("this.environments.envsObject: ", this.environments.envsObject);
        this.configMap.data = this.environments.reduce((prevItem, currItem) => {
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

    getPlainEnvs() {
        let envArray = {};
        Object.entries(this.configMap.data).map((nodoEnv) => {
            const [key, value] = [...nodoEnv];
            envArray = {...envArray, [key]: value};
        });
        return envArray;
    }

    setEnvironments(envObject) {
        this.environments = envObject;
        this.setEnvsInConfigMap();
        this.setOfKeysConfigMapInDeployment();
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

    getVersion() {
        return this.chart.version;
    }

    generateFiles() {
        Shelljs.exec(`cp -R ./files/app-template ${this.basePath}/${this.appName}`);
        fs.writeFileSync(`${this.basePath}/${this.appName}/Chart.yaml`, YAML.stringify(this.chart), 'utf8');
        fs.writeFileSync(`${this.basePath}/${this.appName}/values.yaml`, YAML.stringify(this.values), 'utf8');
        fs.writeFileSync(`${this.basePath}/${this.appName}/templates/configMap.yaml`, YAML.stringify(this.configMap), 'utf8');
        fs.writeFileSync(`${this.basePath}/${this.appName}/templates/deployment.yaml`, YAML.stringify(this.deployment), 'utf8');
    }

}