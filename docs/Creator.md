# Pattern "Creator"

Pattern "Creator" is used to identify the user who created the entity.

In model:
```js
createdBy: { type: Id, ref: 'User', required: true },
```
```

Methods:
```ts
getByIds(ids: string[]): Promise<Entity>;
```

