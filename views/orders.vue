<template>
  <div class="content-container">
    <div class="columns">
      <div class="column">
        <OrdersSearch
          @search="loadOrderHeaders"
          @resetSearch="newSearch"
          :startValues="searchDefaults"
          parent="orders"
        ></OrdersSearch>
        <NoResults
          :newpage="visited"
          :condition="orders"
          :loading="loading"
        ></NoResults>
        <router-link
          :to="{ name: 'order-new' }"
          tag="button"
          class="link card-footer-item"
        >
          <button
            v-if="(role == Roles.admin || role == Roles.userktp)"
            class="button is-primary primary is-outlined"
          >
            <span>{{ "newRequest" | t }} </span>
            <span class="icon">
              <i class="fas fa-plus-square fa-lg"></i>
            </span>
          </button>
        </router-link>
        <div v-if="orders.length != 0" class="section content-title-group">
          <h2 class="title">
            <i class="fas fa-cog"></i>
            {{ "manageRequests" | t }}
          </h2>
          <ul>
            <li v-for="order in orders" :key="order.orderId">
              <div class="card">
                <div class="card-content">
                  <div class="content">
                    <div :key="order.name" class="name">
                      {{ order.publicEntityCode }}
                      {{ order.publicEntityName }}
                    </div>
                    <div class="description is-pulled-right">
                      {{
                        ("orderStatus" +
                          capitalizeWords(OrderStatus[order.orderStatus]))
                          | t
                      }}
                    </div>
                    <div class="description">
                      {{ order.recipientFirstName }}
                      {{ order.recipientLastName }}
                    </div>
                    <div class="description is-pulled-right">
                      {{ order.orderStatusComment }}
                    </div>
                    <div class="description">
                      {{ order.address }}
                      {{ order.addressNo }}
                      {{ order.city }}
                      {{ order.postalCode }}
                      {{ order.regionalUnitDescription }}
                    </div>
                    <div
                      class="description is-pulled-right"
                      v-if="order.relatedOrderId != null"
                    >
                      <router-link
                        :to="{
                          name: 'order-detail',
                          params: { id: order.relatedOrderId },
                        }"
                      >
                        {{ "connectedRequest" | t }} :
                        {{ order.relatedOrderId }}
                      </router-link>
                    </div>
                    <!-- start of nav Level  -->
                    <nav class="level">
                      <div
                        class="level-item has-text-centered"
                        v-for="(orderDetailsInfo,
                        productType) in order.orderDetailsInfo"
                        :key="`orderDetailsInfo-${productType}`"
                      >
                        <div>
                          <p class="heading"></p>
                          <p class="is-info">
                            <strong>
                              {{ orderDetailsInfo.quantity }}
                              {{ orderDetailsInfo.productType }}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </nav>
                    <!-- end of nav Level  -->
                  </div>
                </div>

                <footer class="card-footer">
                  <router-link
                    :to="{
                      name: 'order-detail',
                      params: { id: order.orderId },
                    }"
                    tag="button"
                    class="button is-primary primary is-outlined card-footer-item"
                  >
                    <span>{{ "selectRequest" | t }}</span>
                    <span class="icon">
                      <i class="fas fa-check"></i>
                    </span>
                  </router-link>
                  <button
                    v-if="
                      getOrderStatus(order, 'saved') && (role == Roles.admin || role == Roles.userktp)
                    "
                    @click="confirmFinaliseOrder(order)"
                    class="button is-primary primary has-text-white"
                  >
                    <span>{{ "finaliseRequest" | t }}</span>
                    <span class="icon pd_bot_left">
                      <i class="far fa-thumbs-up fa-lg"></i>
                    </span>
                  </button>
                  <button
                    v-if="
                      getOrderStatus(order, 'completed') && role == Roles.admin
                    "
                    @click="confirmNotReceivedOrder(order)"
                    class="button is-info has-text-white"
                  >
                    <span>{{ "unFinaliseRequest" | t }}</span>
                    <span class="icon pd_bot_left">
                      <i class="fas fa-bell-slash"></i>
                    </span>
                  </button>
                  <button
                    v-if="
                      getOrderStatus(order, 'notReceived') &&
                        (role == Roles.admin || role == Roles.userktp)
                    "
                    @click="confirmRefuelOrder(order)"
                    class="button is-info has-text-white"
                  >
                    <span>{{ "refuelRequest" | t }}</span>
                    <span class="icon">
                      <i class="fas fa-forward"></i>
                    </span>
                  </button>
                  <button
                    v-if="
                      getOrderStatus(order, 'saved') && (role == Roles.admin || role == Roles.userktp)
                    "
                    @click="confirmDeleteOrder(order)"
                    class="fas fa-trash-alt fa-lg button is-danger has-text-white"
                  ></button>
                </footer>
              </div>
            </li>
          </ul>
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
import { OrderService } from "../shared/services/order-service";
import { toast as superToast } from "bulma-toast";
import OrdersSearch from "../components/orders-search.vue";
import {
  ViewOrderResult,
  ViewOrderHeadersResponse,
  ViewOrderHeadersResult,
} from "../shared/modeling/model-results";
import {
  FinalizeOrderRequest,
  RemoveOrderRequest,
  RefuelOrderRequest,
} from "../shared/modeling/model-requests";
import {
  OrderStatus,
  HttpVerbs,
  EndPoints,
  Roles,
} from "../shared/modeling/model-common";
import { langService as t } from "../shared/lang.service";
import { superOk, superNotOk } from "../shared/constants-toast";
import { capitalizeWords } from "../shared/math.lib";
import Pagination from "../components/pagination.vue";
import NoResults from "../components/no-results.vue";
import { GetOrderHeadersRequest } from "../shared/modeling/model-requests";
import { StorageService } from "../shared/services/storage-service";

@Component({
  components: { OrdersSearch, NoResults, Pagination },
  filters: {
    t(value: string) {
      return t.t(value);
    },
  },
})
export default class Orders extends Vue {
  orders: ViewOrderHeadersResult[] = [];
  searchDefaults = { level1: "searchOrderStatus", level2: "1" };
  loading = false;
  orderService: OrderService = new OrderService();
  OrderStatus = OrderStatus;
  capitalizeWords = capitalizeWords;
  visited = true;
  currentPage = 1;
  totalResults = 0;
  totalPages = 0;
  pageSize = 5; //not 10
  role = this.$store.getters.role;
  Roles = Roles;
  persistentFilter: GetOrderHeadersRequest = {};
  storageService: StorageService = new StorageService();
  firstPageVisit = true;

  constructor() {
    super();
  }

  async created() {
    this.checkPageFirstVisit();
    this.currentPage = this.determinePageChange();

    const initFilter: GetOrderHeadersRequest = {
      orderStatus: OrderStatus.saved,
      pageSize: this.pageSize,
      pageNumber: this.currentPage,
    };

    const appliedFilter: GetOrderHeadersRequest = this.getInitFilter(
      initFilter,
    );

    await this.loadOrderHeaders(appliedFilter);
  }

  // edw 8elw kai tous ypoloipous orous ths anazhthshs
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadOrderHeaders(this.persistentFilter);
  }

  getInitFilter(initFilter: GetOrderHeadersRequest): GetOrderHeadersRequest {
    // there is no search items in the localstorage and is the first time the
    // user visits the page
    if (!this.storageService.getManageOrderSearch() && this.firstPageVisit) {
      return initFilter;
    }

    return {};
  }

  async loadOrderHeaders(params: GetOrderHeadersRequest) {
    this.visited = false;
    this.orders = [];
    this.loading = true;
    this.persistentFilter = {};

    // ensure the paging parameters of the params
    if (params) {
      if (this.storageService.getManageOrderSearch()) {
        params = this.storageService.getManageOrderSearch();
      }

      params.pageNumber = this.currentPage;
      params.pageSize = this.pageSize;
      this.persistentFilter = params;
      this.storageService.setManageOrderSearch(this.persistentFilter);
      this.storageService.setPagesSearchKey({
        currentVue: "orders",
        currentPage: this.currentPage,
      });
    }

    const response: ViewOrderHeadersResponse = await this.orderService.hitEndpoint(
      {
        endpoint: EndPoints.ordersOrderHeaders,
        accessMethod: HttpVerbs.get,
        //params: this.persistentFilter,
        params: this.persistentFilter, //this.storageService.getManageOrderSearch(),
      },
    );

    this.orders = response.result;
    this.totalResults = response.totalCount;
    this.totalPages = Math.ceil(response.totalCount / this.pageSize); // defined above

    this.loading = false;
  }

  getOrderStatus(_order: ViewOrderResult, status: string) {
    // @ts-ignore //noimplany
    return _order.orderStatus == OrderStatus[status];
  }

  newSearch() {
    this.currentPage = 1;
    this.persistentFilter = {};
    this.visited = true;
  }

  checkPageFirstVisit() {
    this.firstPageVisit = this.storageService.getOrdersFirstPageVisit();
    if (this.firstPageVisit) {
      this.storageService.setOrdersFirstPageVisit(false);
    }
  }

  determinePageChange() {
    if (this.firstPageVisit) {
      return this.currentPage;
    } else {
      let key = this.storageService.getPagesSearchKey();
      let page = this.currentPage;
      if (key == null) {
        return this.currentPage;
      } else {
        return (page =
          key.currentVue == "orders" ? key.currentPage : this.currentPage);
      }
    }
  }

  async confirmDeleteOrder(_order: ViewOrderResult) {
    let result = false;
    try {
      //show modal
      result = await this.$confirm(t.t("delete", "q"));

      //if user confirms delete, proceed to call server
      if (result) {
        const params = {
          publicEntityCode: _order.publicEntityCode,
          orderId: _order.orderId,
        };
        result = await this.deleteOrder(params);
        if (result) {
          const removeIndex = this.orders
            .map(function(item) {
              return item.orderId;
            })
            .indexOf(_order.orderId);
          this.orders.splice(removeIndex, 1);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async confirmFinaliseOrder(_order: ViewOrderResult) {
    let result = false;
    try {
      result = await this.$confirm(t.t("finalise", "q"));

      if (result) {
        const params: FinalizeOrderRequest = {
          orderId: _order.orderId,
          publicEntityCode: _order.publicEntityCode,
        };
        const res = await this.orderService.hitEndpoint({
          endpoint: EndPoints.ordersFinalizations,
          accessMethod: HttpVerbs.put,
          params: params,
        });
        if (res.length !== 0) {
          // @ts-ignore
          superToast(superOk);
          _order.orderStatus = OrderStatus.finalized;
        } else {
          // @ts-ignore
          superToast(superNotOk);
        }
        return res;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async confirmNotReceivedOrder(_order: ViewOrderResult) {
    let result = false;
    try {
      result = await this.$confirm(t.t("unfinalise", "q"));

      if (result) {
        const params: FinalizeOrderRequest = {
          orderId: _order.orderId,
          publicEntityCode: _order.publicEntityCode,
          // @ts-ignore
          status: OrderStatus.notReceived,
        };
        const res = await this.orderService.hitEndpoint({
          endpoint: EndPoints.ordersUnreceiving,
          accessMethod: HttpVerbs.put,
          params: params,
        });

        if (res) {
          // @ts-ignore
          superToast(superOk);
          _order.orderStatus = OrderStatus.notReceived;
        } else {
          // @ts-ignore
          superToast(superNotOk);
        }
        return res;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async confirmRefuelOrder(_order: ViewOrderResult) {
    let result = false;
    try {
      result = await this.$confirm(t.t("refuelRequest", "q"));

      if (result) {
        const params: RefuelOrderRequest = {
          orderId: _order.orderId,
          publicEntityCode: _order.publicEntityCode,
        };
        const res = await this.orderService.hitEndpoint({
          endpoint: EndPoints.ordersRefuel,
          accessMethod: HttpVerbs.post,
          params: params,
        });

        if (res) {
          // @ts-ignore
          superToast(superOk);
          _order.orderStatus = OrderStatus.cancelled;

          try {
            let result = await this.$confirm(t.t("gotoRequest", "q"));
            if (result) {
              this.$router.push({
                name: "order-detail",
                params: { id: res },
              });
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          // @ts-ignore
          superToast(superNotOk);
        }
        return res;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async deleteOrder(params: RemoveOrderRequest) {
    const res = await this.orderService.hitEndpoint({
      endpoint: EndPoints.orders,
      accessMethod: HttpVerbs.delete,
      params: params,
    });

    if (res) {
      // @ts-ignore
      superToast(superOk);
    } else {
      // @ts-ignore
      superToast(superNotOk);
    }
    return res;
  }
}
</script>
