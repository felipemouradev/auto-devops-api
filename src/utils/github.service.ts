import * as Shelljs from 'shelljs'

export class GithubService {
    appName;
    basePath;

    constructor() {
        Shelljs.exec(`git config --global user.email "autodevops@mailinator.com" && git config --global user.name "AutoDevOps"`)
    }

    setBasePath(basePath) {
        this.basePath = basePath;
    }

    setAppName(appName) {
        this.appName = appName;
    }

    clone({ repoUrl, user, passwd }, execution = null) {
        const remote = repoUrl.replace("https://", "");
        Shelljs.exec(`git clone https://${user}:${passwd}@${remote} ${this.basePath}`);
    }

    stage(file) {
        Shelljs.exec(`cd ${this.basePath} && git add ${file}`);
    }

    commit(message) {
        Shelljs.exec(`cd ${this.basePath} && git commit -m "${message}"`);
    }

    newBranch(branch) {
        Shelljs.exec(`cd ${this.basePath} && git checkout -b ${branch}`);
    }

    push(branch) {
        Shelljs.exec(`cd ${this.basePath} && git push origin ${branch}`);
    }
}