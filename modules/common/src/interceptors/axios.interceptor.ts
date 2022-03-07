import axios, {AxiosRequestConfig} from 'axios';
import {REQUEST_UNIQUE_ID_QUERY_PARAM} from '../constants';
import {getCurrentRequestUniqueId} from '../logger/logger.utils';

export function interceptAxiosRequestWithRequestId (): void {
    axios.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
        if (!config.params) {
            config.params = new URLSearchParams();
        }
        if (typeof config.params.append === 'function') {
            config.params.append(REQUEST_UNIQUE_ID_QUERY_PARAM, getCurrentRequestUniqueId());
        } else {
            config.params = {...config.params, [REQUEST_UNIQUE_ID_QUERY_PARAM]: getCurrentRequestUniqueId()};
        }

        return config;
    });
}
