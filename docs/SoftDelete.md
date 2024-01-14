# Pattern "Soft Delete"

Soft deletion allows you to mark some records as deleted without actual erasure from the database. Effectively, you prevent a soft-deleted record from being selected, meanwhile all old records can still refer to it.

In model:
```js
deletedAt: { type: Date, default: null }
```

Methods:
```ts
deleteItems(ids: string[]): Promise<number>;
```
