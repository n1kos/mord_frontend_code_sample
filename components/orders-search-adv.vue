<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <i class="fas fa-angle-double-right fa-lg"></i> {{ "select" | t }}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <a v-if="this.$props.parent == 'monitor'"
          v-tooltip="{
            content: tooltipTranslate('exportStatsExpl', 't'),
          }"
          href="#"
          class="is-pulled-right image is-64x64"
        >
          <img :src="getXlsImagePath" @click="downloadFile" />
        </a>
        <div class="checkbox is-primary">
          <fieldset>
            <legend class="has-text-weight-bold has-text-grey" for="LOT">
              {{ "lot" | t }}:
            </legend>
            <ul class="list_hor">
              <li>
                <input
                  type="checkbox"
                  name="LOT"
                  v-model="orderLot_All"
                  value="orderLot-All"
                  id="orderLot-All"
                  @click="toggleSelectionAll('orderLot_All')"
                />
                <label for="orderLot-All">{{ "selectAll" | t }}</label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="LOT"
                  value="LOT-1"
                  id="LOT-1"
                  v-model="orderLot"
                />
                <label for="LOT-1">{{ "lot" | t }}-1</label>
              </li>
              <li>
                <input
                  type="checkbox"
                  name="LOT"
                  value="LOT-2"
                  id="LOT-2"
                  v-model="orderLot"
                />
                <label for="LOT-2">{{ "lot" | t }}-2</label>
              </li>
            </ul>
          </fieldset>
        </div>
      </div>

      <div class="content" v-if="parent == 'monitor'">
        <div class="checkbox is-primary">
          <fieldset>
            <legend class="has-text-weight-bold has-text-grey">
              {{ "productType" | t }}:
            </legend>
            <ul class="list_hor">
              <li>
                <input
                  type="checkbox"
                  name="productTypes"
                  value="productType-All"
                  id="productType-All"
                  v-model="productType_All"
                  @click="toggleSelectionAll('productType_All')"
                />
                <label for="productType-All">{{ "selectAll" | t }}</label>
              </li>
              <li v-for="(item, index) in productTypes" :key="index">
                <input
                  type="checkbox"
                  name="productType"
                  :value="item"
                  :id="item"
                  v-model="productType"
                />
                <label :for="item">{{ item }}</label>
              </li>
            </ul>
          </fieldset>
        </div>
      </div>

      <div class="content">
        <div class="checkbox is-primary">
          <fieldset>
            <legend class="has-text-weight-bold has-text-grey">
              {{ "status" | t }}:
            </legend>
            <ul class="list_hor">
              <li>
                <input
                  type="checkbox"
                  name="OrderStatus"
                  value="orderStatus-All"
                  id="orderStatus-All"
                  v-model="orderStatus_All"
                  :disabled="this.$props.parent == 'mass'"
                  @click="toggleSelectionAll('orderStatus_All')"
                />
                <label for="orderStatus-All">{{ "selectAll" | t }}</label>
              </li>
              <li v-for="(item, index) in OrderStatus" :key="index">
                <input
                  type="checkbox"
                  :disabled="disableStatus(item.name)"
                  name="orderStatus"
                  v-if="
                    item.name != 'partiallyCanceled' && item.name != 'refueled'
                  "
                  :value="item.name"
                  :id="item.name"
                  v-model="orderStatus"
                />
                <label
                  :for="item.name"
                  v-if="
                    item.name != 'partiallyCanceled' && item.name != 'refueled'
                  "
                  >{{ item.name | p("orderStatus") | t }}</label
                >
              </li>
            </ul>
          </fieldset>
        </div>
      </div>

      <div class="content">
        <label class="has-text-weight-bold has-text-grey"
          >{{ "publicEntityCode" | t }}:</label
        >
        <autocomplete
          class="field"
          ref="autocompleteInputValue"
          :search="searchPublicEntities"
          :get-result-value="getResultValue"
          :placeholder="'searchEntities' | t"
          @submit="handleSubmit"
          @blur="handleSubmit"
        >
        </autocomplete>
      </div>

      <div class="content">
        <button
          class="button is-primary primary"
          @click="loadOrders"
          type="submit"
        >
          <span>{{ "show" | t }}</span>
          <span class="icon">
            <i class="far fa-eye"></i>
          </span>
        </button>
        <button class="button has-text-weight-bold" @click="clearFilters">
          <span>{{ "clearAll" | t }}</span>
          <span class="icon"><i class="fas fa-broom"></i></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { langService as t } from "../shared/lang.service";
// @ts-ignore
import { dataService } from "../shared/data.service";
import { mapEnum } from "../shared/math.lib";
import { OrderStatus, ProductType, EndPoints } from "../shared/modeling/model-common";
// @ts-ignore
import Autocomplete from "@trevoreyre/autocomplete-vue";
import { GetStatisticsRequest } from "../shared/modeling/model-requests";
// @ts-ignore
import { fileService } from "../shared/file.service";

@Component({
  components: { Autocomplete },
  computed: {
    getXlsImagePath() {
      return require("../assets/excel.png");
    },
  },
  filters: {
    t(value: string) {
      return t.t(value);
    },
    p(value: string, qualifier: string) {
      return t.p(value, qualifier);
    },
  },
  props: ["parent", "startValues"],

  watch: {
    orderLot: function orderLot() {
      // @ts-ignore
      if (this.orderLot.length == this.targets.orderLot.length) {
        // @ts-ignore
        this.orderLot_All = true;
      } else {
        // @ts-ignore
        this.orderLot_All = false;
      }
    },
    productType: function productType() {
      // @ts-ignore
      if (this.productType.length == this.targets.productType.length) {
        // @ts-ignore
        this.productType_All = true;
      } else {
        // @ts-ignore
        this.productType_All = false;
      }
    },

    orderStatus: function orderStatus() {
      // @ts-ignore
      if (this.orderStatus.length == this.targets.orderStatus.length) {
        // @ts-ignore
        this.orderStatus_All = true;
      } else {
        // @ts-ignore
        this.orderStatus_All = false;
      }
    },
  },
})
export default class OrdersSearchAdv extends Vue {
  altExport: string = t.t("exportStats", "q");

  constructor() {
    super();
  }

  async downloadFile() {
    const result = await this.$confirm(t.t("exportStats", "q"));

    if (result) {
      const blobData = await fileService.createHrefLink(EndPoints.fileStatisticsDownload);
      fileService.showExcelFile(blobData);
    }
  }

  /*
    task: select "all" when either all options are selected or when "select all" is selected.
    original implementations where more abstaracted but there was a problem: when selecting the last option, the model
    would be correct but the interface would not be. something with the update cycle of the DOM. this is a solution.
    Have templates with all the options and use these when user selects all. This means though that each model needs to
    have its own watcher
  */
  targets = {
    orderLot: ["LOT-1", "LOT-2"],
    productType: ["A", "B", "C", "DATA"],
    orderStatus: [
      "saved",
      "finalized",
      "registered",
      "sent",
      "completed",
      "notReceived",
      "refueled",
      "cancelled",
      "partiallyCanceled",
    ],
  };

  // vmodels
  orderLot = [];
  orderStatus = [];
  productType = [];
  orderLot_All = false;
  orderStatus_All = false;
  productType_All = false;
  publicEntityCode = null;
  autocompleteInputValue = null;
  get parentp() {
    return this.$props.parent;
  }

  get productTypes() {
    return Object.keys(ProductType).map(function(type) {
      // @ts-ignore //noimplany
      return ProductType[type];
    });
  }
  // @ts-ignore
  OrderStatus = mapEnum(OrderStatus);

  newSearch() {
    this.$emit("resetSearch");
  }

  // @ts-ignore //noimplany
  tooltipTranslate(value, key) {
    return t.t(value, key);
  }

  // @ts-ignore //noimplany
  toggleSelectionAll(modelName) {
    const model = modelName.replace("_All", "");
    // @ts-ignore //noimplany
    if (!this[modelName]) {
      // @ts-ignore //noimplany
      this[model] = this.targets[model];
    } else {
      // @ts-ignore //noimplany
      this[model] = [];
    }
  }

  getResultValue(result: object) {
    // @ts-ignore
    return result.code + " - " + result.name;
  }

  handleSubmit(result: object) {
    // @ts-ignore
    if (result && result.code !== undefined) {
      // @ts-ignore
      this.publicEntityCode = result.code;
    } else {
      try {
        // when blur happens, you get text in the input but you dont get data, so we put data from the input
        // @ts-ignore
        const parts = result.srcElement.value.match(/(^\d+)[ ]*-[ ]*(.*)/);
        this.publicEntityCode = parts[1];
      } catch (e) {
        // blur might happen without results, so perhaps activete validations
      }
    }
  }

  async getPublicEntities(input: string) {
    let params: object | string = {};
    if (input.search(/\d/) >= 0) {
      // @ts-ignore
      params.Code = input;
    } else {
      // @ts-ignore
      params.Name = input;
    }

    // since server only return exact matches on code, dont bother
    // @ts-ignore
    if (params.Code !== undefined && input.length < 6) {
      return [];
    } else {
      return await dataService.getPublicEntities(params);
    }
  }

  async searchPublicEntities(input: string = "") {
    if (input.length < 3) {
      return [];
    }
    const result = await this.getPublicEntities(input);
    return result;
  }

  clearFilters() {
    this.orderLot = [];
    this.orderStatus = [];
    this.productType = [];
    this.orderLot_All = false;
    this.orderStatus_All = false;
    this.productType_All = false;
    this.publicEntityCode = null;
    // @ts-ignore
    this.$refs.autocompleteInputValue.setValue(null);
  }

  loadOrders() {
    const params = {
      lots: [],
      productTypes: [],
      publicEntityCode: "",
      orderStatuses: [],
    } as GetStatisticsRequest;
    if (this.orderLot.length != 0) {
      params["lots"] = this.orderLot;
    } else {
      delete params.lots;
    }
    if (this.productType.length != 0) {
      params["productTypes"] = this.productType;
    } else {
      delete params.productTypes;
    }
    if (this.orderStatus.length != 0) {
      params["orderStatuses"] = this.orderStatus.map(ele => {
        // @ts-ignore
        return this.OrderStatus.find(obj => obj.name == ele).id;
      });
    } else {
      delete params.orderStatuses;
    }
    if (this.publicEntityCode) {
      // @ts-ignore
      params["publicEntityCode"] = this.publicEntityCode;
    } else {
      delete params.publicEntityCode;
    }
    this.$emit("search", params);
  }

  disableStatus(status: string) {
    return (
      this.$props.parent == "mass" &&
      !(status == "saved" || status == "notReceived")
    );
  }
}
</script>
