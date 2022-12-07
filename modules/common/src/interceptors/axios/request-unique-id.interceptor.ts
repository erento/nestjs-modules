import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';
import {REQUEST_UNIQUE_ID_QUERY_PARAM} from '../../constants';
import {getCurrentRequestUniqueId} from '../../logger/logger.utils';
import {AxiosInterceptor} from './axios.interceptor';
import {AxiosFulfilledInterceptor} from './interfaces';
import type {AxiosRequestConfig} from 'axios';

@Injectable()
export class RequestUniqueIdInterceptor extends AxiosInterceptor {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor (httpService: HttpService) {
        super(httpService);
    }

    protected requestFulfilled (): AxiosFulfilledInterceptor<AxiosRequestConfig> {
        return (config: AxiosRequestConfig): AxiosRequestConfig => {
            if (!config.params) {
                config.params = new URLSearchParams();
            }
            if (typeof config.params.append === 'function') {
                config.params.append(REQUEST_UNIQUE_ID_QUERY_PARAM, getCurrentRequestUniqueId());
            } else {
                config.params = {...config.params, [REQUEST_UNIQUE_ID_QUERY_PARAM]: getCurrentRequestUniqueId()};
            }

            return config;
        };
    }
}
