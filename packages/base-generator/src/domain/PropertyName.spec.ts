import { PropertyName } from './PropertyName';
import {KebabCaseNamingPolicy} from "../policies/KebabCaseNamingPolicy";
import {SnakeCaseNamingPolicy} from "../policies/SnakeCaseNamingPolicy";
import {PascalCaseNamingPolicy} from "../policies/PascalCaseNamingPolicy";
import {CamelCaseNamingPolicy} from "../policies/CamelCaseNamingPolicy";
import {UpperCaseNamingPolicy} from "../policies/UpperCaseNamingPolicy";

describe('PropertyName', () => {
  test('create', async () => {
    const propertyName = new PropertyName('name');
    const propertyName2 = new PropertyName('name test');
    const propertyName3 = new PropertyName('name test 123');

    let policy = new KebabCaseNamingPolicy();

    expect(propertyName.toString(policy)).toEqual('name');
    expect(propertyName2.toString(policy)).toEqual('name-test');
    expect(propertyName3.toString(policy)).toEqual('name-test-123');

    policy = new SnakeCaseNamingPolicy();
    expect(propertyName.toString(policy)).toEqual('name');
    expect(propertyName2.toString(policy)).toEqual('name_test');
    expect(propertyName3.toString(policy)).toEqual('name_test_123');

    policy = new PascalCaseNamingPolicy();
    expect(propertyName.toString(policy)).toEqual('Name');
    expect(propertyName2.toString(policy)).toEqual('NameTest');
    expect(propertyName3.toString(policy)).toEqual('NameTest123');

    policy = new CamelCaseNamingPolicy();
    expect(propertyName.toString(policy)).toEqual('name');
    expect(propertyName2.toString(policy)).toEqual('nameTest');
    expect(propertyName3.toString(policy)).toEqual('nameTest123');

    policy = new UpperCaseNamingPolicy();
    expect(propertyName.toString(policy)).toEqual('NAME');
    expect(propertyName2.toString(policy)).toEqual('NAME_TEST');
    expect(propertyName3.toString(policy)).toEqual('NAME_TEST_123');
  });

  test('validate', async () => {
    let policy = new KebabCaseNamingPolicy();

    expect(policy.validate('name')).toBeTruthy();
    expect(policy.validate('name-test-123')).toBeTruthy();
    expect(policy.validate('name_test_123')).toBeFalsy();
    expect(policy.validate('nameTest123')).toBeFalsy();
    expect(policy.validate('NameTest123')).toBeFalsy();
    expect(policy.validate('NAME_TEST_123')).toBeFalsy();

    policy = new SnakeCaseNamingPolicy();

    expect(policy.validate('name')).toBeTruthy();
    expect(policy.validate('name-test-123')).toBeFalsy();
    expect(policy.validate('name_test_123')).toBeTruthy();
    expect(policy.validate('nameTest123')).toBeFalsy();
    expect(policy.validate('NameTest123')).toBeFalsy();
    expect(policy.validate('NAME_TEST_123')).toBeFalsy();

    policy = new PascalCaseNamingPolicy();

    expect(policy.validate('name')).toBeFalsy();
    expect(policy.validate('name-test-123')).toBeFalsy();
    expect(policy.validate('name_test_123')).toBeFalsy();
    expect(policy.validate('nameTest123')).toBeFalsy();
    expect(policy.validate('NameTest123')).toBeTruthy();
    expect(policy.validate('NAME_TEST_123')).toBeFalsy();

    policy = new CamelCaseNamingPolicy();

    expect(policy.validate('name')).toBeTruthy();
    expect(policy.validate('name-test-123')).toBeFalsy();
    expect(policy.validate('name_test_123')).toBeFalsy();
    expect(policy.validate('nameTest123')).toBeTruthy();
    expect(policy.validate('NameTest123')).toBeFalsy();
    expect(policy.validate('NAME_TEST_123')).toBeFalsy();

    policy = new UpperCaseNamingPolicy();

    expect(policy.validate('name')).toBeFalsy();
    expect(policy.validate('name-test-123')).toBeFalsy();
    expect(policy.validate('name_test_123')).toBeFalsy();
    expect(policy.validate('nameTest123')).toBeFalsy();
    expect(policy.validate('NameTest123')).toBeFalsy();
    expect(policy.validate('NAME_TEST_123')).toBeTruthy();
  });

  test('invalidName', async () => {
    expect(() => new PropertyName('приклад')).toThrow('Invalid name');
    expect(() => new PropertyName('12asdada')).toThrow('Invalid name');
  });
});
