import {NamingPolicy, NamingPolicyType} from "./NamingPolicy";

export
class UpperCaseNamingPolicy extends NamingPolicy {
  readonly type:NamingPolicyType = NamingPolicyType.UpperCase;
  transform(name: string): string {
    return name.replace(/ /g, '_').toUpperCase();
  }

  validate(name: string): boolean {
    return name.match(/^[A-Z][A-Z_0-9]*$/g) !== null;
  }
}
