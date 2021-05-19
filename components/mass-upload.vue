<template>
  <div class="content-container">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">
          <i class="fas fa-file-upload"></i>
          {{ "uploadFileLabel" | t }}
        </p>
      </header>

      <div class="card-content">
        <div class="file">
          <label class="file-label">
            <input
              type="file"
              @change="uploadFile($event.target.files)"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              class="file-input"
              name="resume"
            />
            <span class="button is-primary primary is-outlined">
              <span class="file-icon">
                <i class="far fa-file-excel fa-lg"></i>
              </span>
              <span class="file-label">{{ "chooseFile" | t }}</span>
            </span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { toast as superToast } from "bulma-toast";
import { langService as t } from "../shared/lang.service";

@Component({
  filters: {
    t(value: string) {
      return t.t(value);
    },
  },
  props: ["parent"],
})
export default class MassUpload extends Vue {
  fileName = "";
  loading = false;

  created() {
    const parent = this.$props.parent;
  }
  async uploadFile(xlsFile: FileList) {
    if (xlsFile.length !== 0) {
      const fileName = await xlsFile.item(0)!.name;
      this.fileName = fileName;
      //console.log(fileName);
    }
  }

  readXLS(xlsFile: FileList) {}

  constructor() {
    super();
  }
}
</script>
