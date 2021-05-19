<template>
  <div class="content-container">
    <div>
      <!--class="columns"-->
      <ModalBox
        v-show="showModal"
        :message="orderDetails"
        :render="'table'"
        @close="showModal = false"
      ></ModalBox>
      <div>
        <!--class="column"-->
        <OrdersSearch
          @search="loadStagedOrders"
          @resetSearch="newSearch"
          parent="monitor"
        ></OrdersSearch>
        <NoResults
          :newpage="noSearchWasMade"
          :condition="stagedOrders"
          :loading="loading"
        ></NoResults>
        <div
          v-if="stagedOrders.length != 0"
          class="section content-title-group"
        >
          <h2 class="title">
            <i class="fas fa-eye"></i> {{ "monitorRequests" | t }}
          </h2>
          <div class="table-container">
            <table class="table is-narrow is-hoverable TFtable can-expand">
              <thead>
                <tr>
                  <th>
                    <abbr title="RequestId">{{ "requestId" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="productType">{{ "productType" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="status">{{ "status" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="deviceChangeDate">{{
                      "deviceChangeDate" | t
                    }}</abbr>
                  </th>
                  <th>
                    <abbr title="lastName">{{ "lastName" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="firstName">{{ "firstName" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="publicEntityCode">{{
                      "publicEntityCode" | t
                    }}</abbr>
                  </th>
                  <th>
                    <abbr title="publicEntityName">{{
                      "publicEntityName" | t
                    }}</abbr>
                  </th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>
                    <abbr title="RequestId">{{ "requestId" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="productType">{{ "productType" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="status">{{ "status" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="deviceChangeDate">{{
                      "deviceChangeDate" | t
                    }}</abbr>
                  </th>
                  <th>
                    <abbr title="lastName">{{ "lastName" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="firstName">{{ "firstName" | t }}</abbr>
                  </th>
                  <th>
                    <abbr title="publicEntityCode">{{
                      "publicEntityCode" | t
                    }}</abbr>
                  </th>
                  <th>
                    <abbr title="publicEntityName">{{
                      "publicEntityName" | t
                    }}</abbr>
                  </th>
                </tr>
              </tfoot>
              <tbody>
                <tr
                  v-for="order in stagedOrders"
                  :key="order.orderDetailId"
                  @click="showDetails(order.requestId)"
                >
                  <td>{{ order.requestId }}</td>
                  <td>{{ order.productType }}</td>
                  <td>
                    {{ order.orderStatus | getValue(requestStatuses) }}
                  </td>
                  <td>
                    {{ parseDate(order.deviceChangeDate) }}
                  </td>
                  <td>{{ order.recipientLastName }}</td>
                  <td>{{ order.recipientFirstName }}</td>
                  <td>{{ order.publicEntityCode }}</td>
                  <td>{{ order.publicEntityName }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Pagination
            :total-pages="totalPages"
            :total="totalResults"
            :per-page="pageSize"
            :current-page="currentPage"
            @pagechanged="onPageChange"
          ></Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import OrdersSearch from "../components/orders-search.vue";
import ModalBox from "../components/modal-box.vue";
import { langService as t } from "../shared/lang.service";
import { requestStatuses } from "../shared/constants";
import { OrderService } from "../shared/services/order-service";
import { Dictionary } from "vue-router/types/router";
import {
  ViewStagedOrderResult,
  ViewStagedOrderResponse,
} from "../shared/modeling/model-results";
import { parseDate } from "../shared/math.lib";
import { regions } from "../shared/constants";
import Pagination from "../components/pagination.vue";
import NoResults from "../components/no-results.vue";
import { HttpVerbs, EndPoints, Roles } from "../shared/modeling/model-common";
import { StorageService } from "../shared/services/storage-service";
import { GetOrderHeadersRequest } from "../shared/modeling/model-requests";

@Component({
  components: { ModalBox, Pagination, OrdersSearch, NoResults },
  filters: {
    // @ts-ignore //noimplany
    getValue: function(value, list) {
      // @ts-ignore //noimplany
      const status = list.find(x => x.id === value);
      if (status) {
        return status.sts;
      } else {
        // just in case, to prevent app crash
        return t.t("dataError");
      }
    },
    t(value: string) {
      return t.t(value);
    },
  },
})
export default class OrdersMonitor extends Vue {
  stagedOrders: ViewStagedOrderResult[] = [];
  orderService: OrderService = new OrderService();
  requestStatuses: object[] = requestStatuses;
  orderDetails: ViewStagedOrderResult[] = [];
  loading = false;
  firstPageVisit = true; // doesn't matter, it will get a value on created
  noSearchWasMade = true;
  showModal = false;
  currentPage = 1;
  totalResults = 0;
  totalPages = 0;
  pageSize = 10;
  persistentFilter: GetOrderHeadersRequest = {
    pageNumber: this.currentPage,
    pageSize: this.pageSize,
  };
  role = this.$store.getters.role;
  Roles = Roles;
  storageService: StorageService = new StorageService();

  constructor() {
    super();
  }
  async created() {
    this.checkPageFirstVisit();
    // await this.loadStagedOrders(this.$route.params);
  }

  // edw 8elw kai tous ypoloipous orous ths anazhthshs
  onPageChange(page: number) {
    this.persistentFilter.pageNumber = page;
    this.currentPage = page;
    this.persistentFilter = this.swaporderStatusWithOrderDetailsStatus(
      this.persistentFilter,
    );
    this.loadStagedOrders(this.persistentFilter);
  }

  newSearch() {
    this.currentPage = 1;
    this.firstPageVisit = true;
    this.persistentFilter = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
    };
  }

  checkPageFirstVisit() {
    this.firstPageVisit = this.storageService.getOrdersFirstPageVisit();
    if (this.firstPageVisit) {
      this.storageService.setOrdersFirstPageVisit(false);
    }
  }

  // @ts-ignore //noimplany
  redactResults(results: any, role: string) {
    if (role == Roles.userktp) {
      delete results[0].lot;
      delete results[0].fileName;
      delete results[0].fileStatus;
      delete results[0].modifyDate;
      delete results[0].modifyUser;
      delete results[0].batchNo;
      delete results[0].backOfficeStatus;
      delete results[0].backOfficeStatusComment;
      delete results[0].applicationId; // future field
    }
    return results;
  }

  // temp fix till we find out where the "O"rderStatus model is defined
  // which causes a bit of a mess. I get orderStatus, or OrderStatus
  // and I need to manage all that
  swapOrderStatusWithOrderDetailsStatus(order: GetOrderHeadersRequest) {
    // @ts-ignore
    if (order.OrderStatus != undefined) {
      // @ts-ignore
      order["orderDetailStatus"] = order.OrderStatus;
      // @ts-ignore
      delete order.OrderStatus;
    }
    return order;
  }

  swaporderStatusWithOrderDetailsStatus(order: GetOrderHeadersRequest) {
    if (order.orderStatus != undefined) {
      order["orderDetailStatus"] = order.orderStatus;
      delete order.orderStatus;
    }
    return order;
  }

  async loadStagedOrders(params: GetOrderHeadersRequest) {
    this.loading = true;
    this.firstPageVisit = false;

    if (params) {
      params.pageNumber = this.currentPage;
      params.pageSize = this.pageSize;
      // @ts-ignore
      if (params.OrderStatus) {
        params = this.swapOrderStatusWithOrderDetailsStatus(params);
      }

      this.persistentFilter = params;
    }

    const response: ViewStagedOrderResponse = await this.orderService.hitEndpoint(
      {
        endpoint: EndPoints.ordersMonitor,
        accessMethod: HttpVerbs.get,
        params: params,
      },
    );
    this.storageService.setManageOrderSearch(this.persistentFilter);
    this.stagedOrders = response.result;
    this.totalResults = response.totalCount;
    this.totalPages = Math.ceil(response.totalCount / this.pageSize); // defined above
    this.loading = false;
    this.noSearchWasMade = false;
  }

  parseDate = parseDate;

  // so many ways to do this.. the promise couldnt resolve as a computed property while drawing the box
  // so i decided to resolve it here. its a little messy cos you change the object instead of handling
  // the appearance on the box, perhaps consisder fixing this
  async getRegion(regionId: number) {
    return await regions.then(function(result: []) {
      return result.filter(ele => {
        // @ts-ignore
        return ele.regionalUnitId == regionId;
        // @ts-ignore
      })[0].description;
    });
  }

  async showDetails(orderRequestId: string) {
    const response = await this.orderService.hitEndpoint({
      endpoint: EndPoints.ordersMonitor,
      accessMethod: HttpVerbs.get,
      params: { RequestId: orderRequestId },
    });

    this.orderDetails = this.redactResults(response.result, this.role);
    this.orderDetails[0].regionalUnitId = await this.getRegion(
      this.orderDetails[0].regionalUnitId,
    );
    //we dont want to display orderStatus, orderStatusComments, relatedOrderId
    //as we interested in order-details statuses
    delete this.orderDetails[0].orderStatus;
    delete this.orderDetails[0].orderStatusComment;
    delete this.orderDetails[0].relatedOrderId;

    this.showModal = true;
  }
}
</script>
