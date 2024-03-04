export type AxiosFulfilledInterceptor<T> = (value: T) => T | Promise<T>;
export type AxiosRejectedInterceptor = (error: any) => any;
