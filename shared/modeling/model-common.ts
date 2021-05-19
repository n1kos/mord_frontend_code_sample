import {
  FinalizeOrderRequest,
  ChangeOrderRequest,
  RemoveOrderRequest,
  PlaceOrderDetailRequest,
  RefuelOrderRequest,
} from "./model-requests";
import { ViewOrderDetailResult } from "./model-results";
import { Dictionary } from "vue-router/types/router";

export enum ProductType {
  A = "A",
  B = "B",
  C = "C",
  Data = "DATA",
}

// jiliop test
export enum OrderStatus {
  saved = 1, // αποθηκευμένη
  finalized = 2, // οριστικοποιημένη (έτοιμη προς προώθηση στο back-office. δεν μπορεί να αλλάξει πλέον)
  registered = 3, // καταχωρημένη (στα back-office συστήματα)
  sent = 4, // απεσταλμένη
  completed = 5, // ολοκληρωμένη
  notReceived = 6, // ανεπίδοτη (δεν παραλήθφηκε)
  // there is no refuel status anymore, refuel is an action
  // refueled = 7, // επαναπροώθηση (ακύρωση και δημιουργία καινούργιας)
  cancelled = 8, // ακυρωμένη
  partiallyCanceled = 9, // μερικώς ακυρωμένη
}

// used to declare types and endpoints for mass actions
export enum OrderStatusActions {
  finalization = "Finalization",
  notReceived = "notReceived",
  refueling = "Refueling",
}

// export const OrderStatusMap:object = Object.keys(OrderStatus).map(key => ({ id: OrderStatus[key], name: key }));
export enum FileStatus {
  fileIsCreated = 1,
  fileIsReceived = 2,
  fileEposSuccess = 3,
  fileEposFail = 4,
}

export const Roles: {
  admin: string;
  user: string;
  userktp: string;
  userbodss: string;
  userhelpdesk: string;
} = {
  admin: "admin", // όλα τα μενού
  user: "user", // μελλοντική χρήση
  userktp: "userktp", // βλέπει μόνο Διαχείριση Αιτήσεων και Παρουσίαση (ή παρακολούθηση)
  userbodss: "userbodss", // βλέπει μόνο Προώθηση και Παρουσίαση
  userhelpdesk: "userhelpdesk", // (ίδια δικαιώματα με τον BODss, αλλά χωρίς πρόσβαση στο μενού Προώθηση)
};

export interface AccessConfig {
  endpoint: string;
  accessMethod: string;
  params:
    | object
    | Dictionary<string>
    | FinalizeOrderRequest
    | ChangeOrderRequest
    | RemoveOrderRequest
    | PlaceOrderDetailRequest
    | ViewOrderDetailResult
    | RefuelOrderRequest;
}

export enum HttpVerbs {
  post = "post",
  get = "get",
  put = "put",
  delete = "delete",
}

export enum EndPoints {
  orders = "orders",
  ordersOrderHeaders = "orders/orderHeaders",
  ordersOrderDetails = "orders/orderDetails",
  ordersMonitor = "orders/monitor",
  ordersStatistics = "orders/monitor/statistics",
  ordersForwards = "orders/forwards",
  ordersFinalizations = "orders/finalizations",
  ordersForwardsPending = "orders/forwards/pending",
  ordersForwardsAvailability = "orders/forwards/availability",
  ordersUnreceiving = "orders/unreceiving",
  ordersRefuel = "orders/refuel",
  ordersFinalizationCandidates = "orders/finalizations/candidates",
  ordersFinalizationMultiple = "orders/finalizations/multiple",
  ordersRefuelingCandidates = "orders/refuel/candidates",
  ordersRefuelingMultiple = "orders/refuel/multiple",
  ordersLotStatus = "orders/monitor/statistics/lotstatus",
  ordersFilesForwards = "orders/forwards/",
  ordersFilesMultiple = "orders/multiple",
  fileStatisticsDownload = "orders/monitor/statistics/download",
  fileForwardsDownload = "orders/forwards/download",
  fileMultipleDownloadTemplate = "orders/multiple/downloadTemplate",
  fileMultipleDownload = "orders/multiple/download",
  // users = "users",
}

export enum OrderSearchMode {
  searchRegionalUnitId = "searchRegionalUnitId",
  searchPublicEntityCode = "searchPublicEntityCode",
  searchOrderStatus = "searchOrderStatus",
  searchRecipientLastName = "searchRecipientLastName",
  searchMobile = "searchMobile",
  searchRequestId = "searchRequestId",
  searchMsisdn = "searchMsisdn",
  searchAllRequests = "searchAllRequests",
}

export interface PageOrigination {
  currentPage: number;
  currentVue: string;
}
