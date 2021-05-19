<template>
  <div class="content-container">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          <i class="fas fa-file-download"></i>
          {{ "downloadFileLabel" | t }}
        </p>
      </header>

      <div class="card-content">
        <div v-if="hasFiles" class="section content-title-group">
          <ul>
            <!--<li
              v-for="(file, index) in files.slice(0,1)"
              :key="index"
              v-show="controlFileShow(file[index], filesFilter)"
            
            >-->
            <li>
              <!--<div class="card">
                <div class="card-content">
                  <div class="content">
                    <div class="field is-horizontal">-->
              <!-- <a
                        class="filter2 has-text-primary has-text-weight-semibold"
                        @click="downloadFile(file.fileName)"
                        :href="URLs[index]"
                      >{{ file.fileName }}</a>-->

              <a
                @click="downloadFile('template')"
                class="filter2 has-text-primary has-text-weight-semibold"
                ><i class="far fa-file-excel" aria-hidden="true"></i> {{ fileTemplate.fileName }}</a
              >
              <!--</div>
                  </div>
                </div>
              </div>-->
            </li>
          </ul>
        </div>
      </div>
      <div class="notification is-info" v-show="message">
        <Loaderz></Loaderz>
        <h1>{{ message }}</h1>
      </div>
    </div>
    <!--{{ files }}-->
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
export default class FileDownload extends Vue {
  message = "";
  files: object[] = [];
  hasFiles: boolean = false;
  fileTemplate = { blob: null, fileName: "" };

  async created() {
    await this.loadFiles();

    if (this.files != null) {
      await this.files;
      console.log(this.files);
      this.hasFiles = true;
    }

    // we are getting the name AND the content from the same endpoint which means we
    // cant are hitting the endpoint unecessarily if the user does not want to download
    // the template. so, this would be an approach to hit it and store the data so we
    // won't hit it again, but it is best to just hard code the filename
    /**
    let response = await fileService.createHrefLink(EndPoints.fileMultipleDownloadTemplate);
    if (response.headers) {
      this.fileTemplate.fileName = response.headers['content-dispostiion'];
      this.fileTemplate.blob = response.blob;
    } else {
      this.fileTemplate.fileName = "MultipleOrdersPlacingTemplate.xls";
      this.fileTemplate.blob = response;
    }
 */
    this.fileTemplate.fileName = "MultipleOrdersPlacingTemplate.xls";
  }

  // @ts-ignore //noimplany
  async downloadFile(file) {
    console.log(file);

    let endpoint: EndPoints;
    if (file == "template") {
      endpoint = EndPoints.fileMultipleDownloadTemplate;
      file = this.fileTemplate.fileName;
    } else {
      endpoint = EndPoints.fileMultipleDownload;
    }
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
