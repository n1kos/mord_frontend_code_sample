<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form ref="form" @submit.prevent="handleSubmit(onSubmit)">
      <div class="content-container">
        <div class="columns">
          <div class="column">
            <div class="section content-title-group">
              <h2 class="title">
                <i class="fas fa-plus-square"></i>
                {{ "newRequest" | t }}
                <span
                  class="delete is-medium is-right"
                  style="float: right;"
                  @click="cancelOrder"
                ></span>
              </h2>

              <div class="card">
                <div class="card-content">
                  <div class="content has-text-left">
                    <div class="field is-horizontal">
                      <div class="field-label" valign="top">
                        <label class="label" for="lot">{{ "LOT" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider :name="'LOT' | t" v-slot="{ errors }">
                              <input
                                required
                                type="radio"
                                value="LOT-1"
                                name="LOT"
                                v-model="order.lot"
                              />
                              {{ "lot" | t }}-1
                              <input
                                required
                                name="LOT"
                                type="radio"
                                value="LOT-2"
                                v-model="order.lot"
                              />
                              {{ "lot" | t }}-2
                              <span
                                class="is-error"
                              >{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="publicEntityFull">{{ "publicEntityFull" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="required"
                              ref="providerPublicEntity"
                              :name="'publicEntityFull' | t"
                              v-slot="{ validate, errors }"
                            >
                              <autocomplete
                                class="field"
                                ref="publicEntity"
                                :search="searchPublicEntities"
                                :get-result-value="getResultValue"
                                :placeholder="'searchEntities' | t"
                                @submit="handleSearchSubmit"
                                @blur="handleSearchSubmit"
                              ></autocomplete>
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="firstName">{{ "firstName" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              :name="'firstName' | t"
                              rules="onlyGreekLatinCaps"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="3"
                                maxlength="40"
                                class="input"
                                name="firstName"
                                v-model="order.recipientFirstName"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="lastName">{{ "lastName" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyGreekLatinCaps"
                              :name="'lastName' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="3"
                                maxlength="100"
                                class="input"
                                name="lastName"
                                v-model="order.recipientLastName"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="regionalUnitId">{{ "regionalUnitId" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider v-slot="{ errors }">
                              <div class="control">
                                <div class="select">
                                  <select
                                    required
                                    :name="'regionalUnitId' | t"
                                    v-model="order.regionalUnitId"
                                  >
                                    <option
                                      v-for="region in regions"
                                      :value="region.regionalUnitId"
                                      :key="region.regionalUnitId"
                                    >{{ region.description }}</option>
                                  </select>
                                </div>
                                <span class="is-error">{{ errors[0] }}</span>
                              </div>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="mobile">{{ "mobile" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyGreekMobile"
                              :name="'mobile' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="number"
                                minlength="10"
                                maxlength="10"
                                class="input"
                                name="mobile"
                                v-model="order.mobile"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="city">{{ "city" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyGreekCaps"
                              :name="'city' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="3"
                                maxlength="40"
                                class="input"
                                name="city"
                                v-model="order.city"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="postalCode">{{ "postalCode" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider :name="'postalCode' | t" v-slot="{ errors }">
                              <input
                                required
                                type="text"
                                minlength="5"
                                maxlength="5"
                                class="input"
                                name="postalCode"
                                v-model="order.postalCode"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="address">{{ "address" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyGreekLatinCapsSomePunctuation"
                              :name="'address' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="3"
                                maxlength="60"
                                class="input"
                                name="address"
                                v-model="order.address"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="addressNo">{{ "addressNo" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyGreekTitleCapsNumbers"
                              :name="'addressNo' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="1"
                                maxlength="5"
                                class="input"
                                name="addressNo"
                                v-model="order.addressNo"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="floor">{{ "floor" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyGreekCapsSpaceNumber"
                              :name="'floor' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="1"
                                maxlength="10"
                                class="input"
                                name="floor"
                                v-model="order.floor"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="comments">{{ "comments" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider v-slot="{ errors }">
                              <textarea
                                class="textarea"
                                :placeholder="'comments' | t"
                                maxlength="100"
                                name="comments"
                                v-model="order.comments"
                              ></textarea>
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="productType">{{ "productType" | t }}:</label>
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                              <ul class="list_vert">
                                <li v-for="(item, index) in order.orderDetails" :key="index">
                                  <validation-provider
                                  :rules="
                                    `onlyAllowedProducts:${(packet[index],
                                    sumPackets)}`
                                  "
                                  :name="'productType' | t"
                                  v-slot="{ errors }"
                                  >
                                  <input
                                    @input="
                                      validationControl(index, item.quantity)
                                    "
                                    @focusout="updateOthers(index)"
                                    @focusin="updateOthers(index)"
                                    required
                                    name="productType"
                                    type="number"
                                    min="0"
                                    max="100"
                                    v-model="item.quantity"
                                  />
                                  {{ item.productType }}
                                  <span class="is-error">{{ errors[0]}}</span>
                                  </validation-provider>
                                </li>
                              </ul>
                              <!--<span class="is-error">{{errors[0]}}</span>
                            </validation-provider>-->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <footer class="card-footer">
                  <span
                    @click="cancelOrder"
                    class="button cancel-button is-outlined card-footer-item"
                  >
                    <span>{{ "cancel" | t }}</span>
                    <span class="icon">
                      <i class="fas fa-times"></i>
                    </span>
                  </span>
                  <button
                    formnovalidate
                    type="submit"
                    class="button is-primary primary is-outlined has-text-weight-bold card-footer-item"
                  >
                    <span>{{ "submit" | t }}</span>
                    <span class="icon">
                      <i class="fas fa-save"></i>
                    </span>
                  </button>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { dataService } from "../shared";
import { toast as superToast } from "bulma-toast";
import { extend } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import { messages } from "vee-validate/dist/locale/el.json";
import { configure } from "vee-validate";
import { ValidationObserver } from "vee-validate";
import { ValidationProvider } from "vee-validate";
import { langService as t } from "../shared/lang.service";
import { ProductType } from "../shared/modeling/model-common";
import { superOk, superNotOk } from "../shared/constants-toast";
import Autocomplete from "@trevoreyre/autocomplete-vue";

configure({
  classes: {
    valid: "is-valid",
    invalid: "is-invalid",
    dirty: ["is-dirty", "is-dirty"], // multiple classes per flag!
    // ...
  },
});

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: (function(messages, rule) {
      // console.log(messages, rule);
      if (messages[rule] != undefined) {
        return (
          t.t("validateFieldRequired", "t") +
          messages[rule].replace("{_field_}", '"{_field_}"')
        );
      } else {
        return messages[rule];
      }
    })(messages, rule),
  });
});

export default {
  name: "orders-new",
  data() {
    return {
      message: "",
      checkReq: false,
      order: {
        orderId: "",
        publicEntityCode: null,
        publicEntityName: null,
        recipientLastName: null,
        recipientFirstName: null,
        orderDetails: [], // { quantity: 0, productType: ["A", "B", "C", "DATA"] },
        orderDetailsInfo: [],
        regionalUnitId: 1,
        regionalUnitDescription: null,
        city: null,
        mobile: null,
        postalCode: null,
        address: null,
        addressNo: null,
        floor: null,
        comments: null,
        lot: null,
      },
      regions: [],
      sumPackets: 0,
      packet: [],
      myerrors: [],
      productType: Object.keys(ProductType).map(function(type) {
        return ProductType[type];
      }),
    };
  },

  // computed: {
  // },
  async created() {
    this.regions = await dataService.getRegions();
    this.order.orderDetails = this.productType.map((a, i, el) => {
      return { quantity: null, productType: el[i] };
    });
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    Autocomplete,
  },
  filters: {
    t: function(value) {
      return t.t(value);
    },
  },

  methods: {
    onSubmit() {
      this.submit(this.order);
    },

    cancelOrder() {
      this.$router.push({ name: "orders" }); //this.$emit('done');
    },

    async submit(order) {
      console.log("order param: " + order);
      const res = await dataService.getNewOrder(order);
      if (res != null) {
        this.order = res;
        this.$router.push({ name: "orders" }); //this.$emit('done');
        superToast(superOk);
      } else {
        superToast(superNotOk);
      }
    },

    updateOthers(index) {
      for (let i = 0; i < this.productType.length; i++) {
        // Init with zeros rest of the fields
        if (
          i != index &&
          (this.order.orderDetails[i].quantity === null ||
            this.order.orderDetails[i].quantity === "" ||
            isNaN(this.order.orderDetails[i].quantity) ||
            this.order.orderDetails[i].quantity == undefined)
        ) {
          this.order.orderDetails[i].quantity = 0;
        } 
      }
    },

    // ProductType/Packet - Validation 
    validationControl(index, value) {
      let input = value;
      this.sumPackets = 0;
      this.packet = [];
      this.updateOthers(index);
      for (let i = 0; i < this.productType.length; i++) {
        if (
          input === "" ||
          isNaN(input) ||
          input === null ||
          this.order.orderDetails[i].quantity === "" ||
          isNaN(this.order.orderDetails[i].quantity) ||
          this.order.orderDetails[i].quantity === null
        ) {
          if (i != index) {
            if (
              this.order.orderDetails[i].quantity === "" ||
              isNaN(this.order.orderDetails[i].quantity) ||
              this.order.orderDetails[i].quantity === null
            ) {
              this.sumPackets = this.sumPackets;
            } else {
              this.sumPackets =
                this.sumPackets + parseInt(this.order.orderDetails[i].quantity);
              this.packet[i] = parseInt(this.order.orderDetails[i].quantity);
            }
          }
        } else {
          this.packet[i] = parseInt(this.order.orderDetails[i].quantity);
          this.sumPackets =
            this.sumPackets + parseInt(this.order.orderDetails[i].quantity);
        }
      }
    },
    
    getResultValue(result) {
      // @ts-ignore
      return result.code + " - " + result.name;
    },

    async handleCustomComponentChange(e) {
      await this.$refs.providerPublicEntity.validate(e);
    },

    handleSearchSubmit(result) {
      this.handleCustomComponentChange(this.$refs.publicEntity.core.value);
      if (result && result.code !== undefined) {
        // @ts-ignore
        this.order.publicEntityCode = result.code;
        this.order.publicEntityName = result.name;
      } else {
        try {
          // when blur happens, you get text in the input but you dont get data, so we put data from the input
          const parts = result.srcElement.value.match(/(^\d+)[ ]*-[ ]*(.*)/);
          this.order.publicEntityCode = parts[1];
          this.order.publicEntityName = parts[2];
        } catch (e) {
          // blur might happen without results, so perhaps activete validations
        }
      }
    },

    async getPublicEntities(input) {
      let params = {};
      if (input.search(/\d/) >= 0) {
        // @ts-ignore
        params.Code = input;
      } else {
        // @ts-ignore
        params.Name = input;
      }

      // since server only return exact matches on code, dont bother
      // @ts-ignore
      if (params.Code !== undefined && input.length < 6) {
        return [];
      } else {
        return await dataService.getPublicEntities(params);
      }
    },

    async searchPublicEntities(input) {
      if (input.length < 3) {
        return [];
      }
      const result = await this.getPublicEntities(input);
      return result;
    },
  },
};
</script>
