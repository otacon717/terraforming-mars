import { OriginalCorporation } from "./cards/corporation/OriginalCorporation";
import { PreludeCorporation } from "./cards/prelude/PreludeCorporation";
import { VenusCorporation } from "./cards/venusNext/VenusCorporation";
import { ColoniesCorporation } from "./cards/colonies/ColoniesCorporation";
import { TurmoilCorporation } from "./cards/turmoil/TurmoilCorporation";
import { PromoCorporation } from "./cards/promo/PromoCorporation";
import { ReplacementCorporation } from "./cards/handicap/ReplacementCorporation";

export const CorporationName =  { ...OriginalCorporation, ...PreludeCorporation, ...VenusCorporation, ...ColoniesCorporation, ...TurmoilCorporation, ...PromoCorporation, ...ReplacementCorporation }
export type CorporationName = typeof OriginalCorporation | PreludeCorporation | VenusCorporation | ColoniesCorporation | TurmoilCorporation | PromoCorporation |ReplacementCorporation | string;
export enum CorporationGroup {
  ORIGINAL = "Original",
  PRELUDE = "Prelude",
  VENUS_NEXT = "Venus Next",
  COLONIES = "Colonies",
  TURMOIL = "Turmoil",
  PROMO = "Promo",
  HANDICAP = "Handicap"
}

