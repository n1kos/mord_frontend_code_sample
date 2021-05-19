<template>
  <div>
    <!-- generate table - begin-->
    <div v-if="hasFiles" class="section content-title-group">
      <h2 class="title">
        <i class="fas fa-eye"></i>
        {{ "tableOfFiles" | t }}
      </h2>

      <div class="table-container">
        <table class="table is-narrow is-hoverable TFtable can-expand">
          <thead>
            <tr>
              <th>
                <i class="far fa-file-excel" aria-hidden="true"></i>
                <abbr title="fileNameMassTable">{{
                  "fileNameMassTable" | t
                }}</abbr>
              </th>
              <th>
                <i class="far fa-file-excel" aria-hidden="true"></i>
                <abbr title="errorFileName">{{ "errorFileName" | t }} </abbr>
              </th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th>
                <abbr title="fileNameMassTable">{{
                  "fileNameMassTable" | t
                }}</abbr>
              </th>
              <th>
                <abbr title="errorFileName">{{ "errorFileName" | t }}</abbr>
              </th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="file in files" :key="file.fileId">
              <td>
                <!--class="has-text-weight-semibold"-->
                <a
                  class="filter2 has-text-primary has-text-weight-semibold"
                  @click="downloadFile(file.fileName)"
                  >{{ file.fileName }}
                </a>
              </td>
              <td>
                <!--class="has-text-weight-semibold"-->
                <a
                  class="filter2 has-text-primary has-text-weight-semibold"
                  @click="downloadFile(file.errorFileName)"
                  >{{ file.errorFileName }}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- generate table - end-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
// @ts-ignore
import { fileService } from "../shared/file.service";
import { langService as t } from "../shared/lang.service";
import { HttpVerbs, EndPoints } from "../shared/modeling/model-common";
import Loaderz from "../components/loader.vue";

@Component({
  components: { Loaderz },
  filters: {
    t(value: string) {
      return t.t(value);
    },
  },
})
export default class MassFilesTable extends Vue {
  message = "";
  files: object[] = [];
  hasFiles: boolean = false;

  async created() {
    await this.loadFiles();

    if (this.files != null) {
      await this.files;
      //console.log("files--> " + this.files);
      this.hasFiles = true;
    }
  }

  // @ts-ignore //noimplany
  async downloadFile(file) {
    console.log(file);

    let endpoint: EndPoints;

    endpoint = EndPoints.fileMultipleDownload;

    //console.log('endpoint -->'+endpoint);
    const blobData = await fileService.createHrefLink(endpoint, file);
    fileService.showExcelFile(blobData, file);
  }

  // files would be coming form filters. are the filters operating in the items currently available or asking the server? should it be asking the server everytime? like getting a default set and then
  // posting the filters in the server. i dont see another way of doing this... what's the point of filtering inside of the page???
  async loadFiles() {
    this.files = [];
    this.message = t.t("filesLoading");
    this.files = await fileService.getFiles(EndPoints.ordersFilesMultiple);
    //console.log(this.files);
    this.message = "";
  }
}
</script>
