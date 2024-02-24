import {NamingPolicy, NamingPolicyType} from "./NamingPolicy";

export
class SnakeCaseNamingPolicy extends NamingPolicy {
  readonly type:NamingPolicyType = NamingPolicyType.SnakeCase;
  transform(name: string): string {
    return name.replace(/ /g, '_').toLowerCase();
  }

  validate(name: string): boolean {
    return !name.match(/[^a-z0-9_]/g);
  }
}
