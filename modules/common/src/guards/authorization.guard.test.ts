import {ExecutionContext} from '@nestjs/common';
import {SilentUnauthorizedException} from '../exceptions/silent-unauthorized.exception';
import {UnauthorizedException} from '../exceptions/unauthorized.exception';
import {AuthorizationGuard} from './authorization.guard';
import {AuthMetadata} from './interfaces';

const getExecutionContext: (req: any) => ExecutionContext = (req: any): ExecutionContext => <any> {
    switchToHttp: (): any => {
        return {getRequest: (): any => req};
    },
    handler: {},
};

describe('Authorization Guard', (): void => {
    it('Should pass when Auth decorator is not used at all', (): void => {
        const reflector: any = jest.fn()
            .mockReturnValueOnce(undefined);
        const req: Request = <any> {
            headers: {},
        };
        expect(new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toBe(true);
    });

    it('Should authorize when token is not passed', (): void => {
        const reflector: any = jest.fn()
            .mockReturnValueOnce(<AuthMetadata> {
                tokenValue: undefined,
                options: {silent: false},
            });
        const req: Request = <any> {
            headers: {},
        };
        expect(new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toBe(true);
    });

    it('Should authorize when token is passed and matches req header', (): void => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn()
            .mockReturnValueOnce(<AuthMetadata> {
                tokenValue: 'service',
                options: {silent: false},
            });
        expect(new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toBe(true);
    });

    it('Should authorize when token is passed as an array and matches req header', (): void => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn()
            .mockReturnValueOnce(<AuthMetadata> {
                tokenValue: ['x', 'y', 'service', 'z'],
                options: {silent: false},
            });
        expect(new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toBe(true);
    });

    it('Should authorize when req header is passed but no requirements needed', (): void => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn()
            .mockReturnValueOnce(<AuthMetadata> {
                tokenValue: undefined,
                options: {silent: false},
            });
        expect(new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toBe(true);
    });

    it('Should not authorize when token does not matches req header', (): void => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn()
            .mockReturnValueOnce(<AuthMetadata> {
                tokenValue: 'not matching',
                options: {silent: false},
            });
        expect((): boolean => new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toThrowErrorMatchingSnapshot();
    });

    it('Should not authorize when array of tokens does not matches req header', (): void => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn()
            .mockReturnValueOnce(<AuthMetadata> {
                tokenValue: ['not matching', 'not-matching-2'],
                options: {silent: false},
            });
        expect((): boolean => new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toThrowErrorMatchingSnapshot();
    });

    it('Should not authorize when no req header is passed', (): void => {
        const req: Request = <any> {
            headers: {},
        };
        const reflector: any = jest.fn()
            .mockReturnValueOnce(<AuthMetadata> {
                tokenValue: 'not matching',
                options: {silent: false},
            });
        expect((): boolean => new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toThrowErrorMatchingSnapshot();
    });

    it('Should throw laud exception', (): void => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn()
            .mockReturnValueOnce(<AuthMetadata> {
                tokenValue: 'not matching',
                options: {silent: false},
            });
        expect((): boolean => new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toThrowError(UnauthorizedException);
    });

    it('Should throw silent exception', (): void => {
        const req: Request = <any> {
            headers: {
                'x-token-role': 'service',
            },
        };
        const reflector: any = jest.fn()
            .mockReturnValueOnce(<AuthMetadata> {
                tokenValue: 'not matching',
                options: {silent: true},
            });
        expect((): boolean => new AuthorizationGuard(<any> {get: reflector})
            .canActivate(getExecutionContext(req)))
            .toThrowError(SilentUnauthorizedException);
    });
});
