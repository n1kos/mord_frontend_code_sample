import { GetOrderHeadersRequest } from "../modeling/model-requests";
import { PageOrigination } from "../modeling/model-common";

export class StorageService {
  //key for setting and retrieving search values for order management
  private manageOrderSearchKey = "manageOrderSearchKey";
  //key for visiting order page for the first time
  private firstOrderPageVisitKey = "firstOrderPageVisitKey";
  // key for keeping the origin page
  private managePagesSearchKey = "managePagesSearchKey";
  //stores the order manage search selection
  public setManageOrderSearch(selection: GetOrderHeadersRequest) {
    if (selection.orderDetailStatus) {
      selection["orderStatus"] = selection.orderDetailStatus;
      delete selection.orderDetailStatus;
    }
    localStorage.setItem(this.manageOrderSearchKey, JSON.stringify(selection));
  }

  //retrieves the order manage search selection
  public getManageOrderSearch(): GetOrderHeadersRequest {
    let stringified = localStorage.getItem(this.manageOrderSearchKey) as string;

    return JSON.parse(stringified, this.toCamelCase) as GetOrderHeadersRequest;
  }

  //sets the first visit on orders page
  public setOrdersFirstPageVisit(value: boolean) {
    localStorage.setItem(this.firstOrderPageVisitKey, JSON.stringify(value));
  }

  //retrieves the first visit on orders page
  public getOrdersFirstPageVisit(): boolean {
    let stringified = localStorage.getItem(
      this.firstOrderPageVisitKey,
    ) as string;

    //no value found : initialize
    if (!stringified) {
      stringified = "true";
    }

    return JSON.parse(stringified) as boolean;
  }

  //clears the order manage search selection
  public clearManageOrderSearch() {
    localStorage.removeItem(this.manageOrderSearchKey);
  }

  public getPagesSearchKey() {
    let stringified = localStorage.getItem(this.managePagesSearchKey) as string;
    return JSON.parse(stringified, this.toCamelCase) as PageOrigination;
  }

  public setPagesSearchKey(pager: PageOrigination) {
    localStorage.setItem(this.managePagesSearchKey, JSON.stringify(pager));
  }

  //clears all entries in local storage
  public clear() {
    localStorage.clear();
  }

  //Reviever function to ensure that properties names are returned after JSON parsing as camelCase
  private toCamelCase(key: string, value: any) {
    if (value && typeof value === "object") {
      for (var k in value) {
        if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
          value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
          delete value[k];
        }
      }
    }
    return value;
  }
}
