import { Docker } from 'node-docker-api';
const promisifyStream = (stream) => new Promise((resolve, reject) => {
    let result;
    stream.on('data', data => {
        result = data.toString();
    })
    stream.on('end', () => {
        resolve(result)
    });
    stream.on('error', () => {
        reject(result)
    })
});
export class DockerService {
    private docker;
    constructor() {
        this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    }

    async putFile(path = "./files", idContainer = "") {
        const containers = await this.docker.container.list();
        const containerIndex = containers.data.findIndex((container) => {
            console.log("container: ", container);
            return container.data.Id === idContainer;
        });
        console.log("containerIndex: ", containerIndex);
        return containers[containerIndex];
    }

    async exec(command, _container = null, isDeleteContainer = false) {
        let result;
        const instanceDocker = await (_container || this.docker.container).create({
            Image: 'felipemouracv/k8s-helm-aws:3.8.1',
            name: `image-build-${new Date().getTime()}`,
            Cmd: ['/bin/sh', '-c', 'tail -f /dev/null'],
        })
        await instanceDocker.start();
        await instanceDocker.exec.create({
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ["/bin/sh", "-c", command]
        }).then(exec => {
            return exec.start({ Detach: false })
        }).then(async stream => {
            result = await promisifyStream(stream);
        })
        if (isDeleteContainer) {
            await instanceDocker.delete({ force: true });
        }
        console.log("instanceDocker: ", instanceDocker);
        return { message: result, idContainer: instanceDocker.data.Id };
    }
}