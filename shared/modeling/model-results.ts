import { ProductType, OrderStatus } from "./model-common";

export interface ViewPublicEntityResult {
  publicEntityId: number;
  code: string;
  name: string;
}

// defines the structure of the results which are returned from the API end-points
export interface ViewOrderResult {
  orderId: number;
  relatedOrderId: number;
  publicEntityCode: string;
  publicEntityName: string;
  recipientLastName: string;
  recipientFirstName: string;
  orderDetailsInfo: ViewOrderDetailInfo[];
  orderDetails: ViewOrderDetailResult[];
  orderStatus: OrderStatus;
  orderStatusComment: string;
  mobile: string;
  regionalUnitId: number; // κωδ. νομού
  regionalUnitDescription: string; // νομός
  city: string;
  postalCode: string;
  address: string;
  addressNo: number;
  floor: string;
  comments: string;
}

// wrapper to ViewOrderResult for paged results
export interface ViewOrderResponse {
  result: ViewOrderResult[];
  totalCount: number;
  timeGenerated: Date;
}

// contains the pre-calculated number of ViewOrderDetails which are contained in a ViewOrderResult
export interface ViewOrderDetailInfo {
  quantity: number;
  productType: ProductType;
}

export interface ViewOrderDetailResult {
  orderId: number;
  orderDetailId: number;
  requestId: string;
  productType: ProductType;
  msisdn: string;
  imei: string;
  deviceChangeDate: Date;
  status: number;
}

export interface ViewLotAvailabilityResult {
  lot: string;
  productType: string;
  vacancies: number;
}

export interface ViewStagedOrderResult {
  orderId: number;
  relatedOrderId: number;
  publicEntityCode: string;
  publicEntityName: string;
  recipientLastName: string;
  recipientFirstName: string;
  mobile: string;
  regionalUnitId: number; // κωδ. νομού
  regionalUnitDescription: string; // νομός
  city: string;
  postalCode: string;
  address: string;
  addressNo: number;
  floor: string;
  comments: string;
  orderDetailId: number;
  requestId: string;
  productType: string;
  msisdn: string;
  imei: string;
  icc: string;
  deviceChangeDate: Date;
  orderStatus: OrderStatus;
  orderStatusComment: string;
  backOfficeStatus: number;
  backOfficeStatusComment: string;
  lot: string;
  batchNo: number;
  fileName: string;
  fileStatus: number;
  orderDetailStatus: OrderStatus;
  orderDetailStatusComment: string;
  modifyDate: Date;
  modifyUser: string;
}

// wrapper for ViewStagedOrderResult for paged results
export interface ViewStagedOrderResponse {
  result: ViewStagedOrderResult[];
  totalCount: number;
  timeGenerated: Date;
}

// similar to ViewOrderResult except that there are no order-details (ViewOrderDetailResult)
export interface ViewOrderHeadersResult {
  orderId: number;
  relatedOrderId: number;
  publicEntityCode: string;
  publicEntityName: string;
  recipientLastName: string;
  recipientFirstName: string;
  orderDetailsInfo: ViewOrderDetailInfo[];
  orderStatus: OrderStatus;
  orderStatusComment: string;
  mobile: string;
  regionalUnitId: number; // κωδ. νομού
  regionalUnitDescription: string; // νομός
  city: string;
  postalCode: string;
  address: string;
  addressNo: number;
  floor: string;
  comments: string;
}

// wrapper to ViewOrderHeadersResult for paged results
export interface ViewOrderHeadersResponse {
  result: ViewOrderHeadersResult[];
  totalCount: number;
  timeGenerated: Date;
}

// structure for fetching the results of statistics
export interface ViewStatisticsResult {
  lot: string;
  productType: string;
  orderStatus: OrderStatus;
  totalProductTypes: number;
}

export interface ViewStatisticsResultHelper {
  lot: string;
  orderStatus: OrderStatus;
  totalProductTypes: number;
}

// wrapper to ViewStatisticsResult for consistency
export interface ViewStatisticsResponse {
  result: ViewStatisticsResult[];
  totalCount: number;
  timeGenerated: Date;
}

// structure for fetching the results of candidate orders for finalization
export interface ViewFinalizationCandidatesResult {
  orderId: number;
  publicEntityCode: string;
}

// wrapper to ViewFinalizationCandidatesResult for consistency
export interface ViewFinalizationCandidatesResponse {
  result: ViewFinalizationCandidatesResult[];
  totalCount: number;
  timeGenerated: Date;
}

// structure for fetching the results of candidate orders for refueling
export interface ViewRefuelingCandidatesResult {
  orderId: number;
  publicEntityCode: string;
}

// wrapper to ViewRefuelingCandidatesResult for consistency
export interface ViewRefuelingCandidatesResponse {
  result: ViewRefuelingCandidatesResult[];
  totalCount: number;
  timeGenerated: Date;
}

// structure for fetching the results of statistics grouped by lot, status
export interface ViewLotStatusSumResult {
  lot: string;
  orderStatus: OrderStatus;
  totalProductTypes: number;
}

// wrapper to ViewLotStatusSumResult for consistency
export interface ViewLotStatusSumResponse {
  result: ViewLotStatusSumResult[];
  totalCount: number;
  timeGenerated: Date;
}

// wrapper to ViewOrderFilesResult for consistency
export interface ViewOrderFilesResponse {
  result: ViewOrderFilesResult[];
  totalCount: number;
  timeGenerated: Date;
}

// structure for fetching the excel file names which contain the result of multiple order parsing
export interface ViewOrderFilesResult {
  fileId: number;
  fileName: string;
  errorFileName: string;
}

export interface AuthenticateResult {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  userRoleId: number;
  userRoleTitle: string;
  accessToken: string;
  accessTokenExpiration: Date;
  refreshToken: string;
  refreshTokenExpiration: Date;
  forcePwdChange: boolean;
}

// wrapper to AuthenticateResult for consistency
export interface AuthenticateResponse {
  result: AuthenticateResult[];
  totalCount: number;
  timeGenerated: Date;
}

export interface RefreshTokenResult {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  userRoleId: number;
  userRoleTitle: string;
  accessToken: string;
  accessTokenExpiration: Date;
  refreshToken: string;
  refreshTokenExpiration: Date;
  forcePwdChange: boolean;
}

// wrapper to RefreshTokenResult for consistency
export interface RefreshTokenResponse {
  result: RefreshTokenResult[];
  totalCount: number;
  timeGenerated: Date;
}

export interface ViewUserRoleResult {
  userRoleId: number;
  title: string;
}

// wrapper to ViewUserRoleResult for consistency
export interface ViewUserRoleResponse {
  result: ViewUserRoleResult[];
  totalCount: number;
  timeGenerated: Date;
}

export interface ViewUserResult {
  userId: number;
  firstName: string;
  lastName: string;
  tel1: string;
  tel2: string;
  mobile: string;
  fax: string;
  email: string;
  userName: string;
  userRole: object;
  isActive: boolean;
  comments: string;
  modifyDate: Date;
  modifyUser: string;
}

// wrapper to ViewUserResult for consistency
export interface ViewUserResponse {
  result: ViewUserResult[];
  totalCount: number;
  timeGenerated: Date;
}
