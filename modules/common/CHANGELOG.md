<a name="7.5.0"></a>
# 7.5.0 (2023-10-23)
- added additional erento enum

<a name="7.4.0"></a>
# 7.4.0 (2023-09-07)
- added validation exception factory

<a name="7.3.0"></a>
# 7.3.0 (2023-03-07)
- added slugify text to utils.

<a name="7.2.0"></a>
# 7.2.0 (2023-02-09)
- added abstract pubsub pull subscriber

<a name="7.1.0"></a>
# 7.1.0 (2022-12-16)
- use trace&profiler only on beta/production, dev & test should be avoided

<a name="7.0.2"></a>
# 7.0.2 (2022-12-16)
- Another fix to avoid duplicate request id in the url in query param

<a name="7.0.1"></a>
# 7.0.1 (2022-12-16)
- Fix duplicate request id in the url in query param `_requestUniqueId`

<a name="7.0.0"></a>
# 7.0.0 (2022-12-15)
- Upgraded dependencies
- Do not run profiler & trace API during development (on localhost)

**Breaking Changes:**
- Introducing back `BugsnagIgnoreExceptionsInterceptor`
- Decorator `BugsnagIgnoreExceptions` is now again taking care of all exceptions

### New behavior:
**To silence exceptions within functions body use:**
```typescript
@BugsnagIgnoreExceptions([NotFoundException])
```

**To silence exceptions within authorization guard use:**
```typescript
@Auth(AuthorizationType.seller, {silent: true})
```

**To silence `UnauthorizedException` outside of authorization guard use also `BugsnagIgnoreExceptions`:**
```typescript
    @Auth(AuthorizationType.seller, {silent: true})
    @BugsnagIgnoreExceptions([UnauthorizedException])
    public getUserCreditsAsSeller (@Headers(TOKEN_USER_ID_HEADER) userId?: string): Promise<Credit> {
        if (!userId) {
            throw new UnauthorizedException('Unauthorized');
        }
```
In this case `Auth` decorator takes exceptions silent within authorization guard and `BugsnagIgnoreExceptions` within the function's body.

<a name="6.0.0"></a>
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
