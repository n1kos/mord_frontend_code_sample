<template>
  <div class="content-container">
    <OrdersSearchAdv
      @search="loadOrdersStats"
      :parent="parent"
    ></OrdersSearchAdv>
    <NoResults
      :newpage="firstVisit"
      :condition="ordersStats"
      :loading="loading"
    ></NoResults>
    <div v-if="ordersStats.length != 0" class="section content-title-group">
      <h2 class="title">
        <i class="fas fa-angle-double-right"></i>
        <span v-if="this.$props.parent == 'monitor'">{{
          "statsRequests" | t("l")
        }}</span
        ><span v-if="this.$props.parent == 'mass'">{{
          "massRequests" |  t("l")
        }}</span>
      </h2>
      <div class="table-container">
        <table class="table is-narrow TFtable">
          <thead>
            <tr>
              <th>
                <abbr title="LOT">{{ "lot" | t }}</abbr>
              </th>
              <th v-if="this.$props.parent == 'monitor'">
                <abbr title="productType">{{ "productType" | t }}</abbr>
              </th>
              <th>
                <abbr title="status">{{ "status" | t }}</abbr>
              </th>
              <th>
                <abbr title="totalProductTypes">{{
                  "totalProductTypes" | t
                }}</abbr>
              </th>
              <th v-if="this.$props.parent == 'mass'">
                <abbr title="action">{{ "action" | t }}</abbr>
              </th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>
                <abbr title="LOT">{{ "lot" | t }}</abbr>
              </th>
              <th v-if="this.$props.parent == 'monitor'">
                <abbr title="productType">{{ "productType" | t }}</abbr>
              </th>
              <th>
                <abbr title="orderStatus">{{ "status" | t }}</abbr>
              </th>
              <th>
                <abbr title="totalProductTypes">{{
                  "totalProductTypes" | t
                }}</abbr>
              </th>
              <th v-if="this.$props.parent == 'mass'">
                <abbr title="action">{{ "action" | t }}</abbr>
              </th>
            </tr>
          </tfoot>
          <tbody v-if="this.$props.parent == 'monitor'">
            <tr v-for="order in ordersStats" :key="order.orderDetailId">
              <td>{{ order.lot }}</td>
              <td>{{ order.productType }}</td>
              <td>
                {{ order.orderStatus | getValue(requestStatuses) }}
              </td>
              <td>{{ order.totalProductTypes }}</td>
            </tr>
          </tbody>
          <tbody v-if="this.$props.parent == 'mass'">
            <tr v-for="(order, index) in ordersStats" :key="index">
              <td>{{ order.lot }}</td>
              <td>{{ order.orderStatus | getValue(requestStatuses) }}</td>
              <td>{{ order.totalProductTypes }}</td>
              <td>
                <button
                  :disabled="ajaxRequest"
                  class="button is-primary is-small"
                  @click="massAlter(order, OrderStatus[order.orderStatus])"
                  v-if="showMassButtons(order.orderStatus)"
                >
                  <progress
                    style="position: absolute; z-index: 0;"
                    v-if="ajaxRequest"
                    class="progress is-small is-primary"
                    max="100"
                    >15%</progress
                  >
                  <span style="z-index: 1">
                    {{
                      `mass${capitalizeWords(OrderStatus[order.orderStatus])}`
                        | t
                    }}
                  </span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import OrdersSearchAdv from "../components/orders-search-adv.vue";
import { toast as superToast } from "bulma-toast";
import { langService as t } from "../shared/lang.service";
import { requestStatuses } from "../shared/constants";
import { OrderService } from "../shared/services/order-service";
import { Dictionary } from "vue-router/types/router";
import { regions } from "../shared/constants";
import {
  OrderStatus,
  OrderStatusActions,
  HttpVerbs,
  EndPoints,
} from "../shared/modeling/model-common";
import {
  GetStatisticsRequest,
  GetCandidatesRequest,
} from "../shared/modeling/model-requests";
import {
  ViewStatisticsResult,
  ViewStatisticsResponse,
  ViewFinalizationCandidatesResult,
  ViewFinalizationCandidatesResponse,
  ViewStatisticsResultHelper,
} from "../shared/modeling/model-results";
import NoResults from "../components/no-results.vue";
import { capitalizeWords } from "../shared/math.lib";
import { superOk, superNotOk } from "../shared/constants-toast";

@Component({
  components: { OrdersSearchAdv, NoResults },
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
    t(value: string, type: string) {
      return t.t(value, type);
    },
  },
  props: ["parent"],
})
export default class OrdersStats extends Vue {
  ordersStats: ViewStatisticsResult[] = [];
  orderService: OrderService = new OrderService();
  requestStatuses: object[] = requestStatuses;
  OrderStatus = OrderStatus;
  capitalizeWords = capitalizeWords;
  loading = false;
  ajaxRequest = false;
  firstVisit = true;
  persistentPublicEntityCode = null;

  persistentParams: GetStatisticsRequest = {
    lots: [],
    publicEntityCode: "",
    orderStatuses: [],
  };
  // @ts-ignore
  getValue = this.$options.filters.getValue;

  created() {
    const parent = this.$props.parent;
  }

  constructor() {
    super();
  }

  async loadOrdersStats(params: GetStatisticsRequest) {
    this.loading = true;
    const response: ViewStatisticsResponse = await this.orderService.hitEndpoint(
      {
        endpoint:
          this.$props.parent == "mass"
            ? EndPoints.ordersLotStatus
            : EndPoints.ordersStatistics,
        accessMethod: HttpVerbs.get,
        params: params,
      },
    );
    this.ordersStats = response.result;
    // @ts-ignore
    this.persistentPublicEntityCode = params.publicEntityCode;
    this.persistentParams = params;
    this.loading = false;
    this.firstVisit = false;
  }
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

  showMassButtons(status: string) {
    return (
      // @ts-ignore
      OrderStatus[status] == "saved" || OrderStatus[status] == "notReceived"
    );
  }

  async massAlter(order: ViewStatisticsResult, type: string) {
    let result = false;
    try {
      result = await this.$confirm(t.t("massProceed"));

      this.ajaxRequest = true;
      // everything is pretty much the same but the types and the endpoints
      // guess this is not very typescripty thing to do, or maybe there is a way
      // to declare types using variables but I prefer ignoring the compiler than
      // having the same function twice
      // perhaps a better approach would be to break this into to separate functions and
      // call them by passing the var of the right type, so the condition would be used at
      // the top level to decide which type
      let decide = {
        typeDefinition: "",
        endPoint: "",
      };

      // even though the literals are the same, i wanted to decouple the two
      // so i used an object instead of just usind "decide" as a string. it would work now
      // but mayebe in future changes this would be compulsory
      if (type == "saved") {
        decide.typeDefinition = OrderStatusActions.finalization;
        decide.endPoint = OrderStatusActions.finalization;
      } else if (type == OrderStatusActions.notReceived) {
        decide.typeDefinition = OrderStatusActions.refueling;
        decide.endPoint = OrderStatusActions.refueling;
      }
      
      const finalType = "View" + decide.typeDefinition + "CandidatesResponse";
      const finalTypeResult =
        "View" + decide.typeDefinition + "CandidatesResult";
      // @ts-ignore
      // const otherTest: [finalType] = {};
      const params: GetCandidatesRequest = {
        lots: [order.lot],
        // @ts-ignore
        publicEntityCode:
          this.persistentPublicEntityCode != undefined
            ? this.persistentPublicEntityCode
            : null,
      };

      if (params.publicEntityCode == null) {
        delete params.publicEntityCode;
      }

      // @ts-ignore
      const response: [finalType] = await this.orderService.hitEndpoint({
        // @ts-ignore
        endpoint: EndPoints["orders" + decide.endPoint + "Candidates"],
        accessMethod: HttpVerbs.get,
        params: params,
      });

      if (response) {
        // @ts-ignore
        const result: [finalTypeResult] = await this.orderService.hitEndpoint({
          // @ts-ignore
          endpoint: EndPoints["orders" + decide.endPoint + "Multiple"],
          accessMethod: HttpVerbs.put,
          // @ts-ignore
          params: response.result,
        });
        if (result) {
          // @ts-ignore
          superToast(superOk);
          this.loadOrdersStats(this.persistentParams);
        } else {
          // @ts-ignore
          superToast(superNotOk);
        }
      } else {
        // @ts-ignore
        superToast(superNotOk);
      }
      this.ajaxRequest = false;
    } catch (err) {
      console.log(err);
    }
  }
}
</script>
