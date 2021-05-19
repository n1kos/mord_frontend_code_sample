<template>
  <div class="content-container">
    <!--<div class="columns">
      <div class="column">-->
    <div class="section content-title-group">
      <h2 class="title">
        <i class="fas fa-forward"></i> {{ "LOTSelect" | t }}
      </h2>
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th></th>
              <th>
                <abbr title="LOT">{{ "LOT" | t }}</abbr>
              </th>
              <th colspan="2">
                <abbr title="A">A</abbr>
              </th>
              <th colspan="2">
                <abbr title="B">B</abbr>
              </th>
              <th colspan="2">
                <abbr title="C">C</abbr>
              </th>
              <th colspan="2">
                <abbr title="DATA">DATA</abbr>
              </th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <template v-for="n in 4">
                <th :key="n">
                  <abbr title="Δ">{{ "requestsAvailable" | t }}</abbr>
                </th>
                <th :key="n + 4">
                  <abbr title="Ε">{{ "requestsPending" | t }}</abbr>
                </th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in finalisedRequests" :key="index">
              <td>
                <input
                  type="radio"
                  name="lotSelection"
                  :id="item.index"
                  :value="item[0].lot"
                  v-model="lotSelection"
                  :disabled="radioIsDisabled[index] == 0"
                />
              </td>
              <td>{{ item[0].lot }}</td>
              <template v-for="iitem in item[1]">
                <td
                  v-for="(valuez, iindex) in iitem"
                  :key="Math.random(10000) + iindex"
                >
                  <!-- just to get rid of annoying "duplicate key" error -->
                  {{ valuez | sanitise }}
                  <!-- noticed i dont get results all the time -->
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="mrg_left">
      <button
        :disabled="lotSelection == null"
        @click="createFileRequest(lotSelection)"
        class="button is-primary primary is-outlined"
        type="submit"
      >
        <span>{{ "fileNew" | t }} </span>
        <span class="icon">
          <i class="fas fa-plus-square fa-lg"></i>
        </span>
      </button>
    </div>
    <div v-if="hasFiles" class="section content-title-group">
      <h2 class="title">
        <i class="fas fa-forward"></i> {{ "requestsForwarding" | t }}
      </h2>
      <div class="content">
        <div class="card-content">
          <div class="field is-horizontal">
            <h3><i class="fas fa-filter"></i> {{ "filter" | t }}:</h3>
            <span
              v-bind:class="[
                filterIsOn
                  ? 'enabled has-text-primary has-text-weight-bold is-size-5 filter_top'
                  : 'disabled has-text-danger has-text-weight-bold is-size-5 filter_top',
              ]"
              >{{ toggleFileFilterText }}
            </span>
            <div class="control">
              <button
                v-bind:class="[
                  filterIsOn
                    ? 'enabled fas fa-ban is-danger filter_left_top_mrg'
                    : 'disabled fas fa-filter is-primary filter_left_top_mrg',
                ]"
                @click="toggleFileFilter"
                class="button has-text-weight-bold is-size-6"
              >
                <span class="filter_left">{{ "filterChange" | t }}</span>
              </button>
            </div>
            <div
              v-bind:class="[
                filterIsOn ? 'enabled control' : 'disabled control novelos',
              ]"
            >
              <div
                v-bind:class="[
                  filterIsOn
                    ? 'enabled select is-primary filter_left_top_mrg'
                    : 'disabled novelos select is-primary filter_left_top_mrg',
                ]"
              >
                <select
                  v-if="filterIsOn"
                  class="select is-primary"
                  name="filterFiles"
                  v-model="filesFilter"
                >
                  <option v-for="item in fileStatus" :value="item" :key="item">
                    {{ item | t }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul>
        <li
          v-for="(file, index) in files"
          :key="index"
          v-show="controlFileShow(selectedStatus[index], filesFilter)"
        >
          <div class="card">
            <div class="card-content">
              <div class="content">
                <div class="field is-horizontal">
                  <a
                    class="filter2 has-text-primary has-text-weight-semibold"
                    @click="downloadFile(file.fileName)"
                    :href="URLs[index]"
                    >{{ file.fileName }}</a
                  >
                  <div class="control">
                    <div class="select is-primary">
                      <select
                        v-model="selectedStatus[index]"
                        @change="
                          postResults(file.fileId, selectedStatus[index])
                        "
                      >
                        <option
                          v-for="(item, index) in fileStatus"
                          :value="fileStatus[index]"
                          :key="index"
                        >
                          {{ fileStatus[index] | t }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="notification is-info" v-show="message">
      <Loaderz></Loaderz>
      <h1>{{ message }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
// @ts-ignore
import { fileService } from "../shared/file.service";
import { toast as superToast } from "bulma-toast";
import OrdersSearch from "../components/orders-search.vue";
import { langService as t } from "../shared/lang.service";
import { OrderService } from "../shared/services/order-service";
import { ViewOrderResult } from "../shared/modeling/model-results";
import {
  superOk,
  superNotOk,
  superRequestOk,
  superRequestNotOk,
  superFileCreatedOk,
  superFileCreatedNotOk,
} from "../shared/constants-toast";
import { mapEnumList } from "../shared/math.lib";
import { required } from "vee-validate/dist/rules";
import {
  FileStatus,
  HttpVerbs,
  EndPoints,
} from "../shared/modeling/model-common";
import Loaderz from "../components/loader.vue";

@Component({
  components: { OrdersSearch, Loaderz },
  filters: {
    t(value: string) {
      return t.t(value);
    },
    sanitise(value: any) {
      return value != "" ? value : 0;
    },
  },
})
export default class OrdersForwarding extends Vue {
  orders: ViewOrderResult[] = [];
  message = "";
  orderService: OrderService = new OrderService();
  files: object[] = [];
  hasFiles: boolean = false;
  finalisedRequests: object[] = [];
  pendingRequests: object[] = [];
  lotSelection = null;
  selectedStatus: object[] = [];
  // @ts-ignore
  radioIsDisabled: [number, number] = [0, 0];
  fileStatus: any = null;
  // @ts-ignore
  filesFilter: string = FileStatus[FileStatus.fileIsCreated];
  filterIsOn: boolean = false;
  URLs: object[] = [];

  async created() {
    await this.loadPendingRequests();
    await this.loadFinalisedRequests();
    await this.loadFiles();

    if (this.files.length != 0) {
      this.fileStatus = await this.getFileStatuses();
      this.files.map(file => {
        // @ts-ignore
        this.selectedStatus.push(this.fileStatus[file.fileStatus - 1]);
      });
      this.hasFiles = true;
    }
  }
  toggleFileFilter() {
    this.filterIsOn = !this.filterIsOn;
  }

  get toggleFileFilterText() {
    return this.filterIsOn ? t.t("off") : t.t("on");
  }

  controlFileShow(condition: string, filter: string) {
    if (!this.filterIsOn) {
      return true;
    } else {
      return condition == filter;
    }
  }

  // @ts-ignore //noimplany
  async downloadFile(file) {
    const blobData = await fileService.createHrefLink(EndPoints.fileForwardsDownload, file);
    fileService.showExcelFile(blobData, file);
  }

  public disableRadioButtonsIfNotPending(disArray: [number, number]) {
    this.radioIsDisabled = disArray;
  }

  // @ts-ignore //noimplany
  async createFileRequest(lotNo) {
    // if radio button values are the same, when you clink on ANY element
    // the last one of that group (group with the same value) gets selected
    // So, we added product Type to make it distinct, but now we need to
    // sanitise it
    lotNo = lotNo.replace(/\:.*/, "");
    // console.log(lotNo);
    const res = await this.orderService.hitEndpoint({
      endpoint: EndPoints.ordersForwards,
      accessMethod: HttpVerbs.post,
      params: { lot: lotNo },
    });
    if (res) {
      // @ts-ignore
      superToast(superFileCreatedOk);
      // @ts-ignore
      this.$router.go();
    } else {
      // @ts-ignore
      superToast(superFileCreatedNotOk);
    }
  }

  async loadPendingRequests() {
    this.pendingRequests = await this.orderService.hitEndpoint({
      endpoint: EndPoints.ordersForwardsPending,
      accessMethod: HttpVerbs.get,
      params: {},
    });
  }

  async loadFinalisedRequests() {
    let pendingRequestsMutation: object = {};
    this.pendingRequests.map(request => {
      // @ts-ignore
      if (pendingRequestsMutation[request.lot] != undefined) {
        // @ts-ignore
        pendingRequestsMutation[request.lot][request.productType] =
          // @ts-ignore
          request.pending;
      } else {
        // @ts-ignore
        pendingRequestsMutation[request.lot] = {
          // @ts-ignore
          A: "",
          // @ts-ignore
          B: "",
          // @ts-ignore
          C: "",
          // @ts-ignore
          DATA: "",
        };
        // @ts-ignore
        pendingRequestsMutation[request.lot][request.productType] =
          // @ts-ignore
          request.pending;
      }
    });

    const disArray: object[] | any = Object.keys(pendingRequestsMutation)
      // @ts-ignore //noimplany
      .map(ele => pendingRequestsMutation[ele])
      // @ts-ignore //strict
      .map((first, index) =>
        // @ts-ignore //strict
        Object.values(first).reduce((a: number, b: number) => {
          // @ts-ignore
          return a + b;
        }),
      );
    this.disableRadioButtonsIfNotPending(disArray);

    // we get from the server an array of another form
    // and we need to transform it to the output
    let finalisedRequestsMutation: object = {};
    // {
    //   "LOT1" : {a: "", b:"", c:"", d:""},
    //   "LOT2" : {a: "", b:"", c:"", d:""}
    // }
    this.finalisedRequests = await this.orderService.hitEndpoint({
      endpoint: EndPoints.ordersForwardsAvailability,
      accessMethod: HttpVerbs.get,
      params: {},
    });
    this.finalisedRequests.map(request => {
      // @ts-ignore
      if (finalisedRequestsMutation[request.lot] != undefined) {
        // @ts-ignore
        finalisedRequestsMutation[request.lot][request.productType] = [
          // @ts-ignore
          request.vacancies,
          // @ts-ignore
          pendingRequestsMutation[request.lot][request.productType],
        ];
      } else {
        // @ts-ignore
        finalisedRequestsMutation[request.lot] = {
          // @ts-ignore
          A: "",
          // @ts-ignore
          B: "",
          // @ts-ignore
          C: "",
          // @ts-ignore
          DATA: "",
        };
        // @ts-ignore
        finalisedRequestsMutation[request.lot][request.productType] = [
          // @ts-ignore
          request.vacancies,
          // @ts-ignore
          pendingRequestsMutation[request.lot][request.productType],
        ];
      }
    });
    this.finalisedRequests = Object.keys(finalisedRequestsMutation).map(
      index => {
        // @ts-ignore //noimplany
        let obj = finalisedRequestsMutation[index];
        return [{ lot: index }, obj];
      },
    );
  }

  // files would be coming form filters. are the filters operating in the items currently available or asking the server? should it be asking the server everytime? like getting a default set and then
  // posting the filters in the server. i dont see another way of doing this... what's the point of filtering inside of the page???
  async loadFiles() {
    this.files = [];
    this.message = t.t("filesLoading");
    this.files = await fileService.getFiles(EndPoints.ordersFilesForwards);
    this.message = "";
  }

  async getFileStatuses() {
    // @ts-ignore
    return mapEnumList(await fileService.getFileStatuses());
  }

  // @ts-ignore //noimplany
  async postResults(fileId, fileStatus) {
    // todo: enable the code below after appropriate object definition
    // this.files.map((a, i) => (a.status = this.selectedStatus[i]));
    // console.log(fileId, this.fileStatus.indexOf(fileStatus));
    if (
      await fileService.setFileStatus(
        fileId,
        this.fileStatus.indexOf(fileStatus) + 1,
      )
    ) {
      // @ts-ignore
      superToast(superOk);
    } else {
      // @ts-ignore
      superToast(superNotOk);
    }
  }
}
</script>
