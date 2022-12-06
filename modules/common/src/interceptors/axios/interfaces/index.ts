import {AxiosRequestConfig, AxiosResponse} from 'axios';

export type AxiosFulfilledInterceptor<T> = (value: T) => T | Promise<T>;
export type AxiosRejectedInterceptor = (error: any) => any;
export interface AxiosResponseCustomConfig<TConfig extends AxiosRequestConfig> extends AxiosResponse {
    config: TConfig;
}
