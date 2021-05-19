<template>
  <div id="app">
    <HeaderBar />
    <div class="main-section columns is-desktop">
      <NavBar v-if="isAuthenticated" />
      <main class="column is-9-desktop is-10-widescreen">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/header-bar";
import NavBar from "@/components/navbar";
import { mapGetters, mapState } from "vuex";
import { USER_REQUEST } from "./store/actions/user";

export default {
  name: "App",
  components: { HeaderBar, NavBar },
  created: function() {
    if (this.$store.getters.isAuthenticated) {
      this.$store.dispatch(USER_REQUEST);
    }
  },

  computed: {
    ...mapGetters([
      "getProfile",
      "isAuthenticated",
      "isProfileLoaded",
      "getRole",
    ]),
    ...mapState({
      name: state => `${state.user.profile.title} ${state.user.profile.name}`,
    }),
  },

  data() {
    return {
      authenticated: true,
    };
  },
};
</script>

<style lang="scss">
@import "@/design/index.scss";
</style>
