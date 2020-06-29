import {EnvironmentType} from './interfaces';

export class Environments {
    public static getEnv (): EnvironmentType {
        return process.env.NODE_ENV === EnvironmentType.PROD ?
            EnvironmentType.PROD :
            process.env.NODE_ENV === EnvironmentType.TEST ?
                EnvironmentType.TEST :
                process.env.NODE_ENV === EnvironmentType.BETA ?
                    EnvironmentType.BETA :
                    EnvironmentType.DEV;
    }

    public static isProd (): boolean {
        return this.getEnv() === EnvironmentType.PROD || this.getEnv() === EnvironmentType.BETA;
    }

    public static isDev (): boolean {
        return this.getEnv() === EnvironmentType.DEV;
    }

    public static isTest (): boolean {
        return this.getEnv() === EnvironmentType.TEST;
    }

    public static getPackageJson (): any {
        // tslint:disable-next-line no-var-requires no-require-imports
        return require(process.cwd() + '/package.json');
    }

    public static getReleaseStage (): EnvironmentType {
        return this.getEnv();
    }

    public static getVersion (): string {
        return process.env.APP_VERSION || EnvironmentType.DEV;
    }
}
