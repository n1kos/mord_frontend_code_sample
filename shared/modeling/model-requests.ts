import { ProductType, OrderStatus } from "./model-common";

export interface GetPublicEntitiesRequest {
  code: string;
  name: string;
}

// defines the structure of the UI requests to the API end-points

export interface PlaceOrderRequest {
  publicEntityCode: string;
  recipientLastName: string;
  recipientFirstName: string;
  orderDetails: PlaceOrderDetailRequest[];
  mobile: string;
  regionalUnitId: number; // κωδ. νομού
  city: string;
  postalCode: string;
  address: string;
  addressNo: number;
  floor: string;
  comments: string;
  lot: string;
}

export interface ChangeOrderRequest {
  orderId: number;
  publicEntityCode: string;
  recipientFirstName: string;
  recipientLastName: string;
  orderStatus: OrderStatus;
  mobile: string;
  regionalUnitId: number; // κωδ. νομού
  city: string;
  postalCode: string;
  address: string;
  addressNo: number;
  floor: string;
  comments: string;
}

// a specialized case of changing an order :
// finalizes the order and all of its order-details
export interface FinalizeOrderRequest {
  orderId: number;
  publicEntityCode: string;
}

export interface RefuelOrderRequest {
  orderId: number;
  publicEntityCode: string;
}
export interface RemoveOrderRequest {
  publicEntityCode: string;
  orderId: number;
}

export interface PlaceOrderDetailRequest {
  orderId: number;
  productType: ProductType;
}

export interface RemoveOrderDetailRequest {
  orderId: number;
  orderDetailId: number;
}

export interface CreateFileRequest {
  lot: string;
}

export interface ChangeFileRequest {
  fileId: number;
  fileStatus: number;
}

export interface GetOrdersRequest {
  publicEntityCode?: string;
  orderId?: number;
  regionalUnitId?: number;
  recipientLastName?: string;
  mobile?: string;
  orderStatus?: number;
  requestId?: string;
  msisdn?: string;
}

export interface GetOrderHeadersRequest {
  publicEntityCode?: string;
  orderId?: number;
  regionalUnitId?: number;
  recipientLastName?: string;
  mobile?: string;
  orderStatus?: number;
  orderDetailStatus?: number;
  requestId?: string;
  msisdn?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface GetStatisticsRequest {
  lots: string[];
  publicEntityCode?: string;
  productTypes?: string[];
  orderStatuses: number[];
}

export interface GetCandidatesRequest {
  lots: string[];
  publicEntityCode: string;
}

export interface AuthenticateRequest {
  userName: string;
  password: string;
}

export interface RefreshTokensRequest {
  accessToken: string;
  refreshToken: string;
}

export interface AddUserRequest {
  firstName: string;
  lastName: string;
  tel1: string;
  tel2: string;
  mobile: string;
  fax: string;
  email: string;
  userName: string;
  pwd: string;
  userRoleId: number;
  isActive: boolean;
  comments: string;
}

export interface RemoveUserRequest {
  userId: number;
}

export interface GetUsersRequest {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
}
