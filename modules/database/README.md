# NestJS database module

Make you database simple and easy with sequelize. How to use sequelize, please look at it's own documentation.

## How to use it
1. Import this module in your app module:
   
    ```ts
    imports: [
        DatabaseModule.forRoot([
            UserEntity,
            OtherEntity,
            // all entities
        ], {
            dialect: 'postgres',
            port: 5432,
            name: 'database_name',
            user: 'database_user',
            password: 'mysecretpassword',
            host: '127.0.0.1',
        }),
    ]
    ```
2. Import with `forChild` to the rest of the modules (Optional if you have other modules)

    ```ts
    imports: [
        DatabaseModule.forChild()
    ]
    ```

## Gotchas

### Synchronization
You can provide additional options to the module.

To enable synchronization and allow operator aliases you can use following example:

```ts
imports: [
    DatabaseModule.forRoot([...], {...}, {
         syncOptions: {
              alter: true,
         },
         operatorsAliases: true,
     }),
]
```

### Enum values in postgres
Postgres does not support an easy sync with `alter: true` for enum values. As a temporary solution we recommend to use a string, and prepared helpers to generate validation and column size.

**Example:**

```ts
enum UserImportStatus {
    New = 'new',
    InProgress = 'in-progress',
    Completed = 'completed',
    Error = 'error',
}

@Table()
export class UserEntity extends Model<UserEntity> {
    ...
    
    @Column({
        allowNull: false,
        defaultValue: UserImportStatus.New,
        type: DataType.STRING(getMaxLengthOfEnumValues(UserImportStatus)),
        validate: {
            isIn: [getEnumValues(UserImportStatus)],
        },
    })
    public importStatus!: string;

    ...
}
```

_Note: If you want to use Typescript 2.x you will need to use this module in version 1.x._

## Stay in touch

* [Erento's developers](mailto:developers@erento.com) 

## License

This module is [MIT licensed](LICENSE.md).
