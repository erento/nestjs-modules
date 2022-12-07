<a name="5.5.0"></a>
# 6.0.0 (2022-12-07)
**Breaking Changes:**
- removed `interceptAxiosRequestWithRequestId()` method and replaced by `RequestUniqueIdInterceptor`

Usage:
- import it in AppModule in provider and it will be used for all default HttpServices. In case the app is using `HttpModule.register`, you need to provide this interceptor again due to [this axios issue](https://github.com/axios/axios/issues/4938)

**Additional changes:**
- Added default constants as `COMMON_HEADERS`, `USER_AGENT`, etc... repeated in most of the service
- Added `onApplicationInit()` method to remove the same app boilerplate, should be called in `main.ts`
- Added `BasicAppService` and `BaseAppService` which is can be extended in case you need to extend `closeDatabaseConnection()`
- The unique ID is changed from `uuidv4()` to `${Environments.getApplicationName()}_${Environments.getVersion()}_${uuidv4()}`


<a name="5.5.0"></a>
# 5.5.0 (2022-09-28)
- fixed BugsnagIgnoreExceptions behaviour
- removed BugsnagInterceptor

<a name="5.4.0"></a>
# 5.4.0 (2022-09-28)
Added validation pipes:
- boolean-validation.pipe.ts
- iso-date-validation.pipe.ts
- optional-boolean-validation.pipe.ts
- optional-int-validation.pipe.ts
- radius-validation.pipe.ts
- string-list-validation.pipe.ts

<a name="5.3.0"></a>
# 5.3.0 (2022-08-22)
- added sorting param pipe

<a name="5.2.0"></a>
# 5.2.0 (2022-03-25)
- change `AuthorizationGuard` to return `UnauthorizedException`

<a name="5.1.1"></a>
# 5.1.1 (2022-03-25)
- fix wrong usage of rxjs `of()` method

<a name="5.1.0"></a>
# 5.1.0 (2022-03-07)
- added universal request unique id interceptor

<a name="5.0.0"></a>
# 5.0.0 (2022-03-7)
- updated dependencies to latest possible versions
- raised required node >=16.0.0 & npm to >=8.0.0
- replaced TSLint with ESLint
- fixed new linting issues
- updated husky & pre-commit hooks
- changed constructor arguments of LocaleParamPipe
