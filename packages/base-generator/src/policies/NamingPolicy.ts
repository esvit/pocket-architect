export enum NamingPolicyType {
  KebabCase = 'kebab-case',
  CamelCase = 'camel-case',
  PascalCase = 'pascal-case',
  UpperCase = 'upper-case',
  SnakeCase = 'snake-case',
}

export
abstract class NamingPolicy {
  readonly type: NamingPolicyType;

  abstract transform(name: string): string;

  abstract validate(name: string): boolean;
}
