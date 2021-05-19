<template>
  <div class="card">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <p v-if="render == 'text'">{{ message }}</p>
          <div v-if="render == 'table'">
            <div class="table-container">
              <table class="table is-narrow TFtable">
                <thead>
                  <tr>
                    <th colspan="2">
                      {{ "labelOrderDetails" | t }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, key) in message[0]" :key="key">
                    <td>{{ key | t }}</td>
                    <td v-if="key == 'voucher'">
                      <a
                        target="_blank"
                        :href="'https://www.elta-courier.gr/search?br=' + item"
                        >{{ item }}</a
                      >
                    </td>
                    <td v-if="key == 'mobile'">
                      <a :href="'tel:' + item">{{ item }}</a>
                    </td>
                    <td v-if="key == 'fileName'">
                      <a
                        class="filter2 has-text-primary has-text-weight-semibold"
                        @click="downloadFile(item)"
                        >{{ item }}</a
                      >
                    </td>
                    <td
                      v-if="
                        key != 'voucher' && key != 'fileName' && key != 'mobile'
                      "
                    >
                      {{ getMappedFields(item, key) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <button class="modal-close" @click="$emit('close')"></button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { langService as t } from "../shared/lang.service";
import {
  OrderStatus,
  FileStatus,
  EndPoints,
} from "../shared/modeling/model-common";
import { capitalizeWords, parseDate } from "../shared/math.lib";
// @ts-ignore
import { fileService } from "../shared/file.service";

@Component({
  props: ["message", "render"],
  filters: {
    t(value: string) {
      return t.t(value);
    },
  },
})
export default class ModalBox extends Vue {
  constructor() {
    super();
  }

  // @ts-ignore //noimplany
  async downloadFile(file) {
    const blobData = await fileService.createHrefLink(
      EndPoints.fileForwardsDownload,
      file,
    );
    fileService.showExcelFile(blobData, file);
  }

  getMappedFields(value: string, key: string | number) {
    //we have to built the keys to match language file keys
    if (key != "orderDetailStatus") {
      // @ts-ignore
      if (key.match(/date/gi) != null) {
        // @ts-ignore
        return parseDate(value);
      } else if (key == "backOfficeStatus") {
        return t.t("backOfficeStatus" + value);
      } else if (key == "fileStatus") {
        return t.t(FileStatus[parseInt(value, 10)]);
      } else {
        return value;
      }
    } else {
      // @ts-ignore
      return t.t(
        // @ts-ignore
        "orderDetailStatus" + capitalizeWords(OrderStatus[parseInt(value, 10)]),
      );
    }
  }
}
</script>
