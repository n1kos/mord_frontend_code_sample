<template>
  <div>
    <FileDownload parent="massImport"></FileDownload>
    <MassUpload parent="massImport"></MassUpload>
    <MassFilesTable parent="massImport"></MassFilesTable>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import FileDownload from "../components/file-download.vue";
import MassUpload from "../components/mass-upload.vue";
import MassFilesTable from "../components/mass-files-table.vue";

@Component({
  components: { MassUpload, FileDownload, MassFilesTable },
})
export default class MassUploadPage extends Vue {
  constructor() {
    super();
  }
}
</script>
