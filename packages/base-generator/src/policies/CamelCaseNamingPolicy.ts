import {NamingPolicy, NamingPolicyType} from "./NamingPolicy";

export
class CamelCaseNamingPolicy extends NamingPolicy {
  readonly type:NamingPolicyType = NamingPolicyType.CamelCase;
  transform(name: string): string {
    const str = name.split(' ').map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join('');
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  validate(name: string): boolean {
    return name.match(/^[a-z][A-Za-z0-9]*$/g) !== null;
  }
}
