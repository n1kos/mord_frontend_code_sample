<template>
  <!-- https://github.com/foxbenjaminfox/vue-async-computed -->
  <!--start of wanna-be search vue component -->
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        <i class="fas fa-angle-double-right fa-lg"></i>
        {{ "search" | t }}
      </p>
    </header>

    <div class="card-content">
      <div class="content">
        <!--<a href="#" class="card-header-icon" aria-label="more options">-->
        <div class="select is-primary">
          <select
            name="searchLevelOne"
            @change="mainSelectChanged()"
            v-model="searchSelect"
          >
            <option value="searchAllRequests">{{
              "searchAllRequests" | t | upper
            }}</option>
            <option value="searchPublicEntityCode">{{
              "searchPublicEntityCode" | t | upper
            }}</option>
            <option value="searchRegionalUnitId">{{
              "searchRegionalUnitId" | t | upper
            }}</option>
            <option value="searchRecipientLastName">{{
              "searchRecipientLastName" | t | upper
            }}</option>
            <option value="searchMobile">{{
              "searchMobile" | t | upper
            }}</option>
            <option value="searchMsisdn">{{
              "searchMsisdn" | t | upper
            }}</option>
            <option value="searchRequestId">{{
              "searchRequestId" | t | upper
            }}</option>
            <option value="searchOrderStatus">
              {{ "searchOrderStatus" | t | upper }}
            </option>
          </select>
        </div>
        <!--</a>-->
      </div>
    </div>

    <div
      class="card-content"
      v-if="this.isSearchRegionalUnitId()"
      id="searchRegionalUnitId"
    >
      <div class="content">
        <div class="select is-primary">
          <select
            name="searchRegionalUnitId"
            id="searchRegionalUnitId"
            @change="newSearch"
            v-model="selectionRegionalUnitId"
          >
            <option
              :value="item.regionalUnitId"
              v-for="(item, index) in selectedRegion"
              :key="index"
              >{{ item.description }}</option
            >
          </select>
        </div>
      </div>
    </div>

    <div class="card-content" v-if="this.isSearchPublicEntityCode()">
      <div class="content">
        <autocomplete
          class="field"
          ref="autocompleteField"
          :default-value="getAutoCompleteDefaultValue()"
          :search="searchPublicEntities"
          :get-result-value="getAutoCompleteResultValue"
          :placeholder="'searchEntities' | t"
          @submit="handleAutoCompleteSubmit"
          @blur="handleAutoCompleteBlur"
          @keydown="newSearch"
        ></autocomplete>
      </div>
    </div>

    <div class="card-content" v-if="this.isSearchOrderStatus()">
      <div class="content">
        <div class="select is-primary">
          <select
            name="searchOrderStatus"
            id="searchOrderStatus"
            v-model="selectionOrderStatus"
            @change="newSearch"
          >
            <option
              v-show="
                !(
                  parentp == 'monitor' &&
                  (item.name == 'refueled' || item.name == 'partiallyCanceled')
                )
              "
              :value="item.id"
              v-for="(item, index) in OrderStatus"
              :key="index"
              >{{ item.name | p("orderStatus") | t }}</option
            >
          </select>
        </div>
      </div>
    </div>

    <div class="card-content" v-if="this.isSearchRecipientLastName()">
      <div class="content">
        <div class="control has-icons-left has-icons-right">
          <input
            v-model="selectionRecipientLastName"
            class="input is-large is-primary"
            type="text"
            @keydown="newSearch"
            placeholder
          />
          <span class="icon is-medium is-left">
            <i class="fa fa-search"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="card-content" v-if="this.isSearchMobile()">
      <div class="content">
        <div class="control has-icons-left has-icons-right">
          <input
            v-model="selectionMobile"
            class="input is-large is-primary"
            type="text"
            @keydown="newSearch"
            placeholder
          />
          <span class="icon is-medium is-left">
            <i class="fa fa-search"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="card-content" v-if="this.isSearchRequestId()">
      <div class="content">
        <div class="control has-icons-left has-icons-right">
          <input
            v-model="selectionRequestId"
            class="input is-large is-primary"
            type="text"
            @keydown="newSearch"
            placeholder
          />
          <span class="icon is-medium is-left">
            <i class="fa fa-search"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="card-content" v-if="this.isSearchMsisdn()">
      <div class="content">
        <div class="control has-icons-left has-icons-right">
          <input
            v-model="selectionMsisdn"
            class="input is-large is-primary"
            type="text"
            @keydown="newSearch"
            placeholder
          />
          <span class="icon is-medium is-left">
            <i class="fa fa-search"></i>
          </span>
        </div>
      </div>
    </div>

    <div class="card-content">
      <div class="content">
        <button
          class="button is-primary primary"
          @click="loadOrders"
          type="submit"
        >
          <span>{{ "search" | t }}</span>
          <span class="icon">
            <i class="fa fa-search"></i>
          </span>
        </button>
      </div>
    </div>
  </div>
  <!--end of wanna-be search vue component -->
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { langService as t } from "../shared/lang.service";
// @ts-ignore
import { dataService } from "../shared/data.service";
import { mapEnum } from "../shared/math.lib";
import { OrderStatus, OrderSearchMode } from "../shared/modeling/model-common";
import { Dictionary } from "vue-router/types/router";
//ignore linter error message as all the external module declarations have been gathered in libraries.d.ts
//import Autocomplete from "@trevoreyre/autocomplete-vue";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import {
  GetPublicEntitiesRequest,
  GetOrderHeadersRequest,
} from "../shared/modeling/model-requests";
import { ViewPublicEntityResult } from "../shared/modeling/model-results";
import { StorageService } from "../shared/services/storage-service";

@Component({
  components: { Autocomplete },
  filters: {
    t(value: string) {
      return t.t(value);
    },
    p(value: string, qualifier: string) {
      return t.p(value, qualifier);
    },
  },
  props: ["parent", "startValues"],
})
export default class OrdersSearch extends Vue {
  constructor() {
    super();

    this.storageService = new StorageService();
    this.storedSearch = this.storageService.getManageOrderSearch();
  }

  // vmodels
  storageService: StorageService;
  storedSearch: GetOrderHeadersRequest;
  searchSelect = "searchAllRequests"; //default value
  selectionRegionalUnitId = -1;
  selectionPublicEntityCode = "";
  selectionPublicEntityName = "";
  selectionRecipientLastName = "";
  selectionMobile = "";
  selectionRequestId = "";
  selectionMsisdn = "";
  selectionOrderStatus = -1;
  appliedNewSearch = false;
  //autoCompleteDefaultValue = "";

  // dropdowns data
  selectedRegion = [];

  get parentp() {
    return this.$props.parent;
  }

  // @ts-ignore
  OrderStatus = mapEnum(OrderStatus);

  created() {
    this.searchSelect =
      this.$props.startValues == undefined
        ? "searchAllRequests"
        : this.$props.startValues.level1; //default value
    this.selectionOrderStatus =
      this.$props.startValues == undefined
        ? this.selectionOrderStatus
        : this.$props.startValues.level2;

    //initializes the model from the local storage
    this.initializeModelFromStore();

    //decides what which of the stored values will be displayed to the user
    this.decideOnSearchDisplay();
  }

  //initializes model with values from the local store if any
  initializeModelFromStore() {
    this.selectionRecipientLastName = this.getStoredRecipientLastName();
    this.selectionMobile = this.getStoredMobile();
    this.selectionMsisdn = this.getStoredMsisdn();
    this.selectionRequestId = this.getStoredMsisdn();
    this.selectionRequestId = this.getStoredRequestId();
    this.selectionRegionalUnitId = this.getStoredRegionalUnitId();
    this.selectionOrderStatus = this.getStoredStatus();
    this.selectionPublicEntityCode = this.getStoredPublicEntityCode();
  }

  //checks if there are stored values and assigns the visible search outcome depending on the stored values
  decideOnSearchDisplay(): void {
    if (this.getStoredRecipientLastName()) {
      this.searchSelect = OrderSearchMode.searchRecipientLastName;
    } else if (this.getStoredMobile()) {
      this.searchSelect = OrderSearchMode.searchMobile;
    } else if (this.getStoredMsisdn()) {
      this.searchSelect = OrderSearchMode.searchMsisdn;
    } else if (this.getStoredRequestId()) {
      this.searchSelect = OrderSearchMode.searchRequestId;
    } else if (
      this.getStoredRegionalUnitId() &&
      this.getStoredRegionalUnitId() != -1
    ) {
      this.searchSelect = OrderSearchMode.searchRegionalUnitId;
      this.displayRegions();
    } else if (this.getStoredStatus() && this.getStoredStatus() != -1) {
      this.searchSelect = OrderSearchMode.searchOrderStatus;
    } else if (this.getStoredPublicEntityCode()) {
      this.searchSelect = OrderSearchMode.searchPublicEntityCode;
    } else {
      this.searchSelect = OrderSearchMode.searchAllRequests;
    }
  }

  mainSelectChanged() {
    this.displayRegions();

    this.newSearch();
  }

  displayRegions() {
    // dont get regions if the user doesnt search for them
    if (this.isSearchRegionalUnitId()) {
      this.getRegions();
    }
  }

  newSearch() {
    this.appliedNewSearch = true;

    this.$emit("resetSearch");
  }

  //Resets the model variables according to the selection
  resetModel() {
    if (!this.isSearchRegionalUnitId()) {
      this.selectionRegionalUnitId = -1;
    }

    if (!this.isSearchPublicEntityCode()) {
      this.selectionPublicEntityCode = "";
    }

    if (!this.isSearchRecipientLastName()) {
      this.selectionRecipientLastName = "";
    }

    if (!this.isSearchMobile()) {
      this.selectionMobile = "";
    }

    if (!this.isSearchRequestId()) {
      this.selectionRequestId = "";
    }

    if (!this.isSearchMsisdn()) {
      this.selectionMsisdn = "";
    }

    if (!this.isSearchOrderStatus()) {
      this.selectionOrderStatus = -1;
    }

    if (!this.isSearchPublicEntityCode()) {
      this.selectionPublicEntityCode = "";
    }
  }

  loadOrders() {
    let params: object | string = {};
    const searchTerm = this.searchSelect;
    if (searchTerm == OrderSearchMode.searchAllRequests) {
      params = "";
    } else {
      // @ts-ignore //noimplany
      params[searchTerm.replace("search", "")] = this[
        searchTerm.replace("search", "selection")
      ];
    }

    if (this.appliedNewSearch) {
      //on each new search clear the local store
      this.storageService.clearManageOrderSearch();

      //reset the search selection model
      this.resetModel();
    }

    this.$emit("search", params);
  }

  async getPublicEntities(input: string) {
    const params: GetPublicEntitiesRequest = { code: "", name: "" };

    if (input.search(/\d/) >= 0) {
      params.code = input;
    } else {
      params.name = input;
    }

    // since server only return exact matches on code, dont bother
    if (params.code !== "" && input.length < 6) {
      return [];
    } else {
      return await dataService.getPublicEntities(params);
    }
  }

  async getRegions() {
    if (this.selectedRegion.length == 0) {
      this.selectedRegion = await dataService.getRegions();
    }
  }

  getAutoCompleteResultValue(result: ViewPublicEntityResult): string {
    return result.code + " - " + result.name;
  }

  getAutoCompleteDefaultValue(): string {
    if (this.selectionPublicEntityCode) {
      return this.selectionPublicEntityCode; // + " - " + this.selectionPublicEntityName
    }

    return "";
  }

  handleAutoCompleteSubmit(result: ViewPublicEntityResult) {
    this.selectionPublicEntityCode = result.code;
    this.selectionPublicEntityName = result.name;
  }

  handleAutoCompleteBlur(e: Event) {
    try {
      // when blur happens, you get text in the input but you dont get data, so we put data from the input
      const input = e.target as HTMLInputElement;
      const parts = input.value.match(
        /(^\d+)[ ]*-[ ]*(.*)/,
      ) as RegExpMatchArray;
      this.selectionPublicEntityCode = parts[1];
    } catch (e) {
      // blur might happen without results, so perhaps activete validations
    }
  }

  async searchPublicEntities(input = "") {
    if (input.length < 3) {
      return [];
    }
    this.newSearch();
    const result = await this.getPublicEntities(input);
    return result;
  }

  ///retrieves public entity code if exists in the local store
  getStoredPublicEntityCode(): string {
    if (this.storedSearch) return this.storedSearch.publicEntityCode as string;

    return "";
  }

  ///retrieves recepient last name if exists in the local store
  getStoredRecipientLastName(): string {
    if (this.storedSearch) return this.storedSearch.recipientLastName as string;

    return "";
  }

  ///retrieves mobile number if exists in the local store
  getStoredMobile(): string {
    if (this.storedSearch) return this.storedSearch.mobile as string;

    return "";
  }

  ///retrieves msisdn number if exists in the local store
  getStoredMsisdn(): string {
    if (this.storedSearch) return this.storedSearch.msisdn as string;

    return "";
  }

  ///retrieves requestId  if exists in the local store
  getStoredRequestId(): string {
    if (this.storedSearch) return this.storedSearch.requestId as string;

    return "";
  }

  ///retrieves regionalUnitId  if exists in the local store
  getStoredRegionalUnitId(): number {
    if (this.storedSearch) return this.storedSearch.regionalUnitId as number;

    return -1;
  }

  //retrieves status  if exists in the local store
  getStoredStatus(): number {
    if (this.storedSearch) return this.storedSearch.orderStatus as number;

    return -1;
  }

  isSearchAllRequests(): boolean {
    return this.searchSelect == OrderSearchMode.searchAllRequests;
  }

  isSearchPublicEntityCode(): boolean {
    return this.searchSelect == OrderSearchMode.searchPublicEntityCode;
  }

  isSearchOrderStatus(): boolean {
    return this.searchSelect == OrderSearchMode.searchOrderStatus;
  }

  isSearchRegionalUnitId(): boolean {
    return this.searchSelect == OrderSearchMode.searchRegionalUnitId;
  }

  isSearchRecipientLastName(): boolean {
    return this.searchSelect == OrderSearchMode.searchRecipientLastName;
  }

  isSearchMobile(): boolean {
    return this.searchSelect == OrderSearchMode.searchMobile;
  }

  isSearchRequestId(): boolean {
    return this.searchSelect == OrderSearchMode.searchRequestId;
  }

  isSearchMsisdn(): boolean {
    return this.searchSelect == OrderSearchMode.searchMsisdn;
  }
}
</script>
