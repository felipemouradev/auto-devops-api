import * as AWS from 'aws-sdk';
export class AWSService {
    ecrClient;
    ssmClient;
    constructor() {
        this.ecrClient = new AWS.ECR({
            apiVersion: '2015-09-21',
            region: process.env.AWS_REGION || 'us-east-2'
        });

        this.ssmClient = new AWS.SSM({
            apiVersion: '2014-11-06',
            region: process.env.AWS_REGION || 'us-east-2'
        });
    }

    async createSSMParameters(name: string, envs: any) {
        var params = {
            Name: name,
            Value: JSON.stringify(envs),
            Type: "StringList"
        };
        return new Promise((resolve, reject) => {
            this.ssmClient.putParameter(params, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        });

    }

    async createECRRepository(name) {
        var params = {
            repositoryName: name
        };
        return new Promise((resolve, reject) => {
            this.ecrClient.createRepository(params, function (err, data) {
                if (err) reject(err);
                else resolve(data);
            });
        })
    }
}