<template>
  <OrdersStats parent="monitor"></OrdersStats>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import OrdersStats from "../components/orders-stats.vue";

@Component({
  components: { OrdersStats },
})
export default class OrdersStatsPage extends Vue {
  constructor() {
    super();
  }
}
</script>
