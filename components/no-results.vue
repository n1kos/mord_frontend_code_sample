<template>
  <div>
    <div v-if="getCondition" class="content">
      <h5>{{ "noResults" | t }}</h5>
    </div>
    <div class="notification is-info" v-if="getLoading">
      <Loaderz></Loaderz>
      <h1>{{ "loadResults" | t }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { langService as t } from "../shared/lang.service";
import Loaderz from "./loader.vue";

@Component({
  props: ["condition", "newpage", "loading"],

  components: { Loaderz },

  filters: {
    t(value: string) {
      return t.t(value);
    },
  },
})
export default class NoResults extends Vue {
  constructor() {
    super();
  }

  get getCondition() {
    return (
      !this.$props.loading &&
      this.$props.condition.length == 0 &&
      this.$props.newpage != 1
    );
  }

  get getLoading() {
    return this.$props.loading;
  }
}
</script>
