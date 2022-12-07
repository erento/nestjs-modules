import {Environments} from './environments';
import {EnvironmentType} from './interfaces';

describe('Environments', (): void => {
    test('should determine environment correctly', (): void => {
        const oldEnv: string | undefined = process.env.NODE_ENV;

        process.env.NODE_ENV = 'undefined-value';
        expect(Environments.getEnv())
            .toBe(EnvironmentType.DEV);
        expect(Environments.isProd())
            .toBe(false);
        expect(Environments.isTest())
            .toBe(false);
        expect(Environments.isDev())
            .toBe(true);

        process.env.NODE_ENV = 'development';
        expect(Environments.getEnv())
            .toBe(EnvironmentType.DEV);
        expect(Environments.isProd())
            .toBe(false);
        expect(Environments.isTest())
            .toBe(false);
        expect(Environments.isDev())
            .toBe(true);

        process.env.NODE_ENV = 'production';
        expect(Environments.getEnv())
            .toBe(EnvironmentType.PROD);
        expect(Environments.isProd())
            .toBe(true);
        expect(Environments.isTest())
            .toBe(false);
        expect(Environments.isDev())
            .toBe(false);

        process.env.NODE_ENV = 'test';
        expect(Environments.getEnv())
            .toBe(EnvironmentType.TEST);
        expect(Environments.isProd())
            .toBe(false);
        expect(Environments.isTest())
            .toBe(true);
        expect(Environments.isDev())
            .toBe(false);

        process.env.NODE_ENV = 'beta';
        expect(Environments.getEnv())
            .toBe(EnvironmentType.BETA);
        expect(Environments.isProd())
            .toBe(true);
        expect(Environments.isTest())
            .toBe(false);
        expect(Environments.isDev())
            .toBe(false);

        process.env.NODE_ENV = oldEnv;
    });
});
