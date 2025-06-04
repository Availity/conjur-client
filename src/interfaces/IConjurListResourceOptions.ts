import type { ConjurResourceKind } from './ConjurResourceKind.js';

export interface IConjurListResourceOptions {
  kind?: ConjurResourceKind;
  search?: string;
  limit?: number;
  offset?: number;
  count?: boolean;
  actingAs?: string;
}
