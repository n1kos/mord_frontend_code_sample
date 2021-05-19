<template>
  <div class="columns">
    <!--is-centered is-vcentered-->
    <!--<div class="column is-12-tablet is-9-desktop is-5">-->
    <div
      class="column is-12-desktop is-offset-2-desktop is-6-widescreen is-offset-4-widescreen is-6-fullhd is-offset-4-fullhd"
    >
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            <i class="fas fa-angle-double-right fa-lg"></i> {{ "login" | t }}
          </p>
        </header>

        <div class="card-content">
          <div class="content">
            <form class="login" @submit.prevent="login">
              <div class="control has-text-centered">
                <label for="admin" class="radio">
                  <input
                    class="radio"
                    name="admin"
                    v-model="username"
                    type="radio"
                    value="admin"
                    id="admin"
                  />
                  {{ "admin" | t }}
                </label>

                <label for="userktp" class="radio">
                  <input
                    class="radio"
                    name="userktp"
                    v-model="username"
                    type="radio"
                    value="userktp"
                    id="userktp"
                  />
                  {{ "userktp" | t }}
                </label>

                <label for="userbodss" class="radio">
                  <input
                    class="radio"
                    name="userbodss"
                    v-model="username"
                    type="radio"
                    value="userbodss"
                    id="userbodss"
                  />
                  {{ "userbodss" | t }}
                </label>
                <label for="userhelpdesk" class="radio">
                  <input
                    class="radio"
                    name="userhelpdesk"
                    v-model="username"
                    type="radio"
                    value="userhelpdesk"
                    id="userhelpdesk"
                  />
                  {{ "userhelpdesk" | t }}
                </label>
              </div>
              <hr />
              <div class="has-text-centered">
                <button class="button is-primary primary" type="submit">
                  <span>{{ "login" | t }}</span>
                  <span class="icon is-large">
                    <i class="fas fa-sign-in-alt fa-lg"></i>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { langService as t } from "../shared/lang.service";
import { AUTH_REQUEST } from "../store/actions/auth";

export default {
  filters: {
    t: function(value) {
      return t.t(value);
    },
  },

  data() {
    return {
      username: "",
      password: "whatevs",
    };
  },

  methods: {
    login: function(uer) {
      const { username, password } = this;
      this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
        this.$router.push("/");
      });
    },
  },
};
</script>
