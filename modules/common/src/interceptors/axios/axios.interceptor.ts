import {identityFulfilled, identityRejected} from './consts';
import {AxiosFulfilledInterceptor, AxiosRejectedInterceptor} from './interfaces';
import type {HttpService} from '@nestjs/axios';
import type {OnModuleInit} from '@nestjs/common';
import type {AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse} from 'axios';

export abstract class AxiosInterceptor<
    TRequestConfig extends AxiosRequestConfig = AxiosRequestConfig,
    TResponse extends AxiosResponse = AxiosResponse,
> implements OnModuleInit {
    protected constructor (protected readonly httpService: HttpService) {}

    public onModuleInit (): void {
        this.registerInterceptors();
    }

    protected requestFulfilled (): AxiosFulfilledInterceptor<TRequestConfig> {
        return identityFulfilled;
    }

    protected requestRejected (): AxiosRejectedInterceptor {
        return identityRejected;
    }

    protected responseFulfilled (): AxiosFulfilledInterceptor<TResponse> {
        return identityFulfilled;
    }

    protected responseRejected (): AxiosRejectedInterceptor {
        return identityRejected;
    }

    private registerInterceptors (): void {
        const {axiosRef} = this.httpService;

        (<AxiosInterceptorManager<TRequestConfig>> axiosRef.interceptors.request).use(
            this.requestFulfilled(),
            this.requestRejected(),
        );

        (<AxiosInterceptorManager<TResponse>> axiosRef.interceptors.response).use(
            this.responseFulfilled(),
            this.responseRejected(),
        );
    }
}
