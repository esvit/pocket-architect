import {NamingPolicy, NamingPolicyType} from "./NamingPolicy";

export
class PascalCaseNamingPolicy extends NamingPolicy {
  readonly type:NamingPolicyType = NamingPolicyType.PascalCase;

  transform(name: string): string {
    return name.split(' ').map((i) => i.charAt(0).toUpperCase() + i.slice(1)).join('');
  }

  validate(name: string): boolean {
    return name.match(/^[A-Z][A-Za-z0-9]*$/g) !== null;
  }
}
