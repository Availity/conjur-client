export interface IConjurPolicyLoadDryRunItem {
  identifier: string;
  id: string;
  type: string;
  owner: string;
  policy: string | null;
  permissions: Record<string, string>;
  annotations: Record<string, string>;
  members: Array<string>;
  memberships: Array<string>;
  restricted_to: Array<string>;
}
