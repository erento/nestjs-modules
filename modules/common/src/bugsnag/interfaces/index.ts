export enum BugsnagSeverity {
    INFO = 'info',
    WARNING = 'warn',
    ERROR = 'error',
}

export type BugsnagErrorFunction = (error: Error) => void;
