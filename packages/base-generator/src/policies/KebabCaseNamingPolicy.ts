import {NamingPolicy, NamingPolicyType} from "./NamingPolicy";

export
class KebabCaseNamingPolicy extends NamingPolicy {
  readonly type:NamingPolicyType = NamingPolicyType.KebabCase;

  transform(name: string): string {
    return name.replace(/ /g, '-').toLowerCase();
  }

  validate(name: string): boolean {
    return !name.match(/[^a-z0-9-]/g);
  }
}
