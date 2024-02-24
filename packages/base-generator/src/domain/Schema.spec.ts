import {Schema} from './Schema';
import {SchemaObjectType, SchemaObjectId} from './SchemaObject';
import {NamingPolicyType} from "../policies/NamingPolicy";

describe('Schema', () => {
  test('create', async () => {
    const objects = [
      {id: '1', name: 'SchemaObject 1', type: SchemaObjectType.Domain},
      {id: '2', name: 'SchemaObject 1 - Child 1', parentId: '1', type: SchemaObjectType.BoundedContext},
      {id: '3', name: 'SchemaObject 1 - Child 1 - SubChild 1', parentId: '2', type: SchemaObjectType.Entity},
      {id: '4', name: 'SchemaObject 1 - Child 1 - SubChild 2', parentId: '2', type: SchemaObjectType.Entity},
      {id: '5', name: 'SchemaObject 1 - Child 2', parentId: '1', type: SchemaObjectType.Aggregate},
    ];
    const schema = Schema.create({
      objects
    });
    expect(schema.getObjectById(new SchemaObjectId('2')).toJSON()).toEqual({
      id: '2',
      "name": "SchemaObject 1 - Child 1",
      "parentId": "1",
      sortIndex: 1,
      "type": "bounded-context"
    });
    expect(schema.listSchemaObjects.map(i => i.toJSON())).toEqual([
      {
        id: '1',
        sortIndex: 0,
        "name": "SchemaObject 1",
        "type": "domain"
      },
      {
        id: '2',
        sortIndex: 1,
        "name": "SchemaObject 1 - Child 1",
        "parentId": "1",
        "type": "bounded-context"
      },
      {
        id: '3',
        sortIndex: 2,
        "name": "SchemaObject 1 - Child 1 - SubChild 1",
        "parentId": "2",
        "type": "entity"
      },
      {
        id: '4',
        sortIndex: 3,
        "name": "SchemaObject 1 - Child 1 - SubChild 2",
        "parentId": "2",
        "type": "entity"
      },
      {
        id: '5',
        sortIndex: 4,
        "name": "SchemaObject 1 - Child 2",
        "parentId": "1",
        "type": "aggregate"
      }
    ]);
    expect(schema.objects[0].toJSON()).toEqual({
      id: '1',
      sortIndex: 0,
      "name": "SchemaObject 1",
      "type": "domain",
    });
    expect(schema.objects[0].objects[0].toJSON()).toEqual({
      id: '2',
      sortIndex: 1,
      "name": "SchemaObject 1 - Child 1",
      "parentId": "1",
      "type": "bounded-context",
    });
    expect(schema.objects[0].objects[1].toJSON()).toEqual({
      id: '5',
      sortIndex: 4,
      "name": "SchemaObject 1 - Child 2",
      "parentId": "1",
      "type": "aggregate",
    });
  });
  test('changeParent', async () => {
    const objects = [
      {id: '1', name: 'SchemaObject 1', type: SchemaObjectType.Domain},
      {id: '2', name: 'SchemaObject 1 - Child 1', parentId: '1', type: SchemaObjectType.BoundedContext},
      {id: '3', name: 'SchemaObject 1 - Child 1 - SubChild 1', parentId: '2', type: SchemaObjectType.Entity},
      {id: '4', name: 'SchemaObject 1 - Child 2', parentId: '1', type: SchemaObjectType.Aggregate},
    ];
    const schema = Schema.create({
      objects
    });
    const node1 = schema.getObjectById(new SchemaObjectId('3'));
    const node2 = schema.getObjectById(new SchemaObjectId('4'));
    schema.changeParent(node1, node2);
    expect(schema.getObjectById(new SchemaObjectId('3')).toJSON()).toEqual({
      id: '3',
      sortIndex: 2,
      "name": "SchemaObject 1 - Child 1 - SubChild 1",
      "parentId": "4",
      "type": "entity"
    });
  });

  test('detectNamingPolicy', async () => {
    expect(Schema.detectNamingPolicy('NAME_TEST_123')).toEqual(NamingPolicyType.UpperCase);
    expect(Schema.detectNamingPolicy('name_test_123')).toEqual(NamingPolicyType.SnakeCase);
    expect(Schema.detectNamingPolicy('name-test-123')).toEqual(NamingPolicyType.KebabCase);
    expect(Schema.detectNamingPolicy('NameTest123')).toEqual(NamingPolicyType.PascalCase);
    expect(Schema.detectNamingPolicy('nameTest123')).toEqual(NamingPolicyType.CamelCase);
    expect(Schema.detectNamingPolicy('name')).toEqual(NamingPolicyType.KebabCase);
  });
});
