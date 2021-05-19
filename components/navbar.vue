<template>
  <nav class="column is-3-desktop is-2-widescreen menu">
    <!--p class="menu-label">{{ "menuOptions" | t }}</p>-->
    <ul class="menu-list">
      <li>
        <router-link to="/orders"
          ><i class="fas fa-cog"></i>
          {{ "menuManageRequests" | t }}</router-link
        >
      </li>
      <li class="menu-ident">
        <router-link
          to="/mass"
          v-if="role == Roles.admin || role == Roles.userktp"
          ><i class="fas fa-cog"></i>
          {{ "menuMassManageRequests" | t }}</router-link
        >
      </li>
      <li class="menu-ident">
        <router-link
          to="/massImport"
          v-if="role == Roles.admin || role == Roles.userktp"
          ><i class="fas fa-upload"></i>
          {{ "menuMassImportRequests" | t }}</router-link
        >
      </li>
      <li>
        <router-link
          v-if="role == Roles.admin || role == Roles.userbodss"
          :to="`/others/search/orderStatus/${OrderStatus.saved}`"
          ><i class="fas fa-forward"></i>
          {{ "forwardRequests" | t }}</router-link
        >
      </li>
      <!-- the route below is part of the orders-forwardinging view. it can later become 
        a separate component -->
      <!-- <router-link to="/files">Αρχεία</router-link> -->
      <li>
        <router-link to="/monitor"
          ><i class="fas fa-eye"></i>
          {{ "menuMonitorRequests" | t }}</router-link
        >
      </li>
      <li class="menu-ident">
        <router-link to="/stats"
          ><i class="far fa-file-excel"></i> {{ "stats" | t }}</router-link
        >
      </li>
      <!-- <router-link to="/about">{{ "menuHelp" | t }}</router-link> -->
      <li>
        <a @click="logout" class="nav-item nav-link"
          ><i class="fas fa-sign-out-alt"></i> {{ "logout" | t }}</a
        >
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { langService as t } from "../shared/lang.service";
import { OrderStatus, Roles } from "../shared/modeling/model-common";
import { AUTH_LOGOUT } from "../store/actions/auth";
import { StorageService } from "../shared/services/storage-service";

@Component({
  filters: {
    t(value: string) {
      return t.t(value);
    },
  },
})
export default class NavBar extends Vue {
  storageService: StorageService = new StorageService();
  OrderStatus = OrderStatus;
  Roles = Roles;
  role = this.$store.getters.role;

  constructor() {
    super();
  }

  logout() {
    localStorage.removeItem("role");

    //clear all entries from storage
    this.storageService.clear();

    this.$store.dispatch(AUTH_LOGOUT).then(() => this.$router.push("/login"));
  }
}
</script>
