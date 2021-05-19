import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toasted from "vue-toasted";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import VTooltip from "v-tooltip";
import VueSimpleAlert from "vue-simple-alert";

// add global validation rules.
import "./shared/validation.js";

Vue.use(Toasted);
Vue.use(VTooltip);
Vue.use(VueSimpleAlert);

Vue.config.productionTip = false;

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);

Vue.filter("upper", function(_value: string): string {
  if (!_value) {
    return "";
  }
  const value: string = _value.toString();
  return value.toUpperCase();
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
