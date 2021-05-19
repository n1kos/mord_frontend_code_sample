import { OrderStatus } from "./modeling/model-common";
import { langService as t } from "./lang.service";
import { LookUpService } from "./services/lookup-service";
export const inputDateFormat: string = "yyyy-MM-dd";
export const displayDateFormat: string = "MMM dd, yyyy";
export const displayTimeFormat: string = "HH:mm:ss.SSS";
export const locale: string = "el";
const lookupService: LookUpService = new LookUpService();

export const regions: object[] | any = lookupService.lookup("regionalUnits");
export const roles: object[] | any = lookupService.lookup("userRoles");

export const requestStatuses: object[] = [
  {
    id: OrderStatus.saved,
    sts: t.t("orderStatusSaved"),
  },
  {
    id: OrderStatus.finalized,
    sts: t.t("orderStatusFinalized"),
  },
  {
    id: OrderStatus.registered,
    sts: t.t("orderStatusRegistered"),
  },
  {
    id: OrderStatus.sent,
    sts: t.t("orderStatusSent"),
  },
  {
    id: OrderStatus.completed,
    sts: t.t("orderStatusCompleted"),
  },
  {
    id: OrderStatus.notReceived,
    sts: t.t("orderStatusNotReceived"),
  },
  {
    id: OrderStatus.cancelled,
    sts: t.t("orderStatusCancelled"),
  },
];
