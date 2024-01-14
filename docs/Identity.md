# Pattern "Identity"

Pattern "Identity" is used to identify the object. Automatically adds the field "id" to entities.

In model:
```js
id: { type: string }
```

Methods:
```ts
getByIds(ids: string[]): Promise<Entity>;
```

