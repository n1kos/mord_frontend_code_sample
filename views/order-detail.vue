<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form ref="form" @submit.prevent="handleSubmit(onSubmit)">
      <div class="section content-title-group">
        <h2 class="title">
          <i class="fas fa-edit"></i>
          {{ "editRequests" | t }}
          <span
            class="delete is-medium is-right"
            style="float: right;"
            @click="cancelOrder"
          ></span>
        </h2>
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">{{ fullName }}</p>
          </header>
          <div class="card-content">
            <div class="content">
              <div class="field is-horizontal">
                <div class="field-label">
                  <label class="label" for="id">{{ "id" | t }}:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <label class="input" name="id" readonly>{{
                      order.orderId
                    }}</label>
                  </div>
                </div>
              </div>
              <BulmaAccordion>
                <BulmaAccordionItem>
                  <i slot="title">
                    <i class="fas fa-angle-right"></i>
                    {{ "requestDetails" | t }}
                  </i>
                  <i slot="icon-closed" class="fas fa-caret-down fa-lg"></i>
                  <i slot="icon-open" class="fas fa-caret-up fa-lg"></i>
                  <div slot="content">
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="firstName"
                          >{{ "firstName" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyGreekLatinCaps"
                              :name="'firstName' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                class="input"
                                name="firstName"
                                minlength="3"
                                maxlength="40"
                                v-model="order.recipientFirstName"
                                :readonly="formIsReadOnly()"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="lastName"
                          >{{ "lastName" | t }}:</label
                        >
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
                                :readonly="formIsReadOnly()"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="mobile"
                          >{{ "mobile" | t }}:</label
                        >
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
                                :readonly="formIsReadOnly()"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="regionalUnitId"
                          >{{ "regionalUnitId" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              :name="'regionalUnitId' | t"
                              v-slot="{ errors }"
                            >
                              <div class="control">
                                <div class="select">
                                  <select
                                    required
                                    name="regionalUnitId"
                                    v-model="order.regionalUnitId"
                                    :disabled="formIsReadOnly()"
                                  >
                                    <option
                                      v-for="region in regions"
                                      :value="region.regionalUnitId"
                                      :key="region.regionalUnitId"
                                      >{{ region.description }}</option
                                    >
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
                        <label class="label" for="city"
                          >{{ "city" | t }}:</label
                        >
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
                                :readonly="formIsReadOnly()"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="postalCode"
                          >{{ "postalCode" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              :name="'postalCode' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="5"
                                maxlength="5"
                                class="input"
                                name="postalCode"
                                v-model="order.postalCode"
                                :readonly="formIsReadOnly()"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="address"
                          >{{ "address" | t }}:</label
                        >
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
                                :readonly="formIsReadOnly()"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="addressNo"
                          >{{ "addressNo" | t }}:</label
                        >
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
                                :readonly="formIsReadOnly()"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="floor"
                          >{{ "floor" | t }}:</label
                        >
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
                                :readonly="formIsReadOnly()"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="comments"
                          >{{ "comments" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <!-- comments is optional field -->
                            <validation-provider v-slot="{ errors }">
                              <textarea
                                class="textarea"
                                :placeholder="'comments' | t"
                                maxlength="100"
                                name="comments"
                                v-model="order.comments"
                                :readonly="formIsReadOnly()"
                                :disabled="formIsReadOnly()"
                              ></textarea>
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </BulmaAccordionItem>
              </BulmaAccordion>
              <BulmaAccordion
                :dropdown="false"
                :initialOpenItem="1"
                :icon="'custom'"
                :slide="{
                  duration: '.9s',
                  timerFunc: 'ease',
                }"
              >
                <!-- {{ order }} -->
                <BulmaAccordionItem
                  v-for="(orderDetailsInfo,
                  productType) in order.orderDetailsInfo"
                  :key="`orderDetailsInfo-${productType}`"
                >
                  <h4 slot="title">
                    <i class="fas fa-angle-right"></i>
                    {{ orderDetailsInfo.quantity }}
                    {{ orderDetailsInfo.productType }}
                  </h4>
                  <i slot="icon-closed" class="fas fa-caret-down fa-lg"></i>
                  <i slot="icon-open" class="fas fa-caret-up fa-lg"></i>
                  <div slot="content">
                    <div class="table-container">
                      <table class="table is-narrow">
                        <thead>
                          <tr>
                            <th>
                              <abbr title="orderDetailId">{{
                                "orderDetailId" | t
                              }}</abbr>
                            </th>
                            <th>
                              <abbr title="requestId">{{
                                "requestId" | t
                              }}</abbr>
                            </th>
                            <th>
                              <abbr title="msisdn">{{ "msisdn" | t }}</abbr>
                            </th>
                            <th>
                              <abbr title="imei">{{ "imei" | t }}</abbr>
                            </th>
                            <th>
                              <abbr title="icc">{{ "icc" | t }}</abbr>
                            </th>
                            <th>
                              <abbr title="status">{{ "status" | t }}</abbr>
                            </th>
                          </tr>
                        </thead>
                        <tfoot>
                          <tr>
                            <th>
                              <abbr title="orderDetailId">{{
                                "orderDetailId" | t
                              }}</abbr>
                            </th>
                            <th>
                              <abbr title="requestId">{{
                                "requestId" | t
                              }}</abbr>
                            </th>
                            <th>
                              <abbr title="msisdn">{{ "msisdn" | t }}</abbr>
                            </th>
                            <th>
                              <abbr title="imei">{{ "imei" | t }}</abbr>
                            </th>
                            <th>
                              <abbr title="icc">{{ "icc" | t }}</abbr>
                            </th>
                            <th>
                              <abbr title="status">{{ "status" | t }}</abbr>
                            </th>
                          </tr>
                        </tfoot>
                        <!-- {{
                      order.orderDetails
                        }}-->
                        <tbody>
                          <tr
                            v-for="item in filteredBy(
                              order.orderDetails,
                              orderDetailsInfo.productType,
                            )"
                            :key="item.orderDetailId"
                          >
                            <th>{{ item.orderDetailId }}</th>
                            <td>{{ item.requestId }}</td>
                            <td>{{ item.msisdn }}</td>
                            <td>{{ item.imei }}</td>
                            <td>{{ item.icc }}</td>
                            <td>
                              {{ item.status | getValue(requestStatuses) }}
                            </td>
                            <td
                              v-if="
                                item.status == requestStatuses[0].id &&
                                  !formIsReadOnly() &&
                                  role == Roles.admin || role == Roles.userktp
                              "
                            >
                              <a
                                v-on:click="
                                  deleteRequest(item, order.orderDetails)
                                "
                                class="delete is-large"
                              ></a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <span class></span>
                  <button
                    :disabled="formIsReadOnly() || role == Roles.userbodss || role== Roles.userhelpdesk"
                    class="button is-primary primary is-outlined"
                    slot="footer"
                    type="button"
                    @click="
                      createOrderDetails(
                        order.orderId,
                        orderDetailsInfo.productType,
                      )
                    "
                  >
                    <span>{{ "newRequestDetail" | t }}</span>
                    <span class="icon">
                      <i class="fas fa-plus-square fa-lg"></i>
                    </span>
                  </button>
                </BulmaAccordionItem>
              </BulmaAccordion>
            </div>
          </div>
          <footer class="card-footer">
            <span
              class="button cancel-button is-outlined card-footer-item"
              @click="cancelOrder()"
            >
              <span>{{ "cancel" | t }}</span>
              <span class="icon">
                <i class="fas fa-times"></i>
              </span>
            </span>
            <button
              type="submit"
              class="button is-primary primary is-outlined has-text-weight-bold card-footer-item"
              :disabled="formIsReadOnly() || role == Roles.userbodss || role == Roles.userhelpdesk"
            >
              <span>{{ "submit" | t }}</span>
              <span class="icon">
                <i class="fas fa-save"></i>
              </span>
            </button>
          </footer>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// @ts-ignore
import { dataService } from "../shared/data.service";
import { format, parseISO } from "date-fns";
// @ts-ignore //noimplany
import { BulmaAccordion, BulmaAccordionItem } from "vue-bulma-accordion";
import { toast as superToast } from "bulma-toast";
import {
  extend,
  configure,
  ValidationObserver,
  ValidationProvider,
} from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import { messages } from "vee-validate/dist/locale/el";
import { langService as t } from "../shared/lang.service";
import { superOk, superNotOk } from "../shared/constants-toast";
import {
  OrderStatus,
  HttpVerbs,
  EndPoints,
  Roles,
} from "../shared/modeling/model-common";
import {
  ViewOrderResult,
  ViewOrderResponse,
} from "../shared/modeling/model-results";
import {
  RemoveOrderDetailRequest,
  PlaceOrderDetailRequest,
  ChangeOrderRequest,
} from "../shared/modeling/model-requests";
import { requestStatuses, displayDateFormat } from "../shared/constants";
import { el } from "date-fns/locale";
import { OrderService } from "../shared/services/order-service";

@Component({
  components: {
    BulmaAccordion,
    BulmaAccordionItem,
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  filters: {
    // @ts-ignore //noimplany
    getValue: function(value, list) {
      // @ts-ignore //noimplany
      const status = list.find(x => x.id === value);
      if (status) {
        return status.sts;
      } else {
        // just in case, to prevent app crash
        return t.t("dataError");
      }
    },
    // @ts-ignore //noimplany
    t: function(value) {
      return t.t(value);
    },
  },
})
export default class OrderDetail extends Vue {
  // configure({
  //   classes: {
  //     valid: "is-valid",
  //     invalid: "is-invalid",
  //     dirty: ["is-dirty", "is-dirty"], // multiple classes per flag!
  //     // ...
  //   }
  // });

  checkReq = false;
  order = {} as ViewOrderResult;
  regions = {};
  // this should be coming from the server, eventually
  requestStatuses = requestStatuses;
  OrderStatus = OrderStatus;
  displayDateFormat = displayDateFormat;
  el = el;
  orderService: OrderService = new OrderService();
  role = this.$store.getters.role;
  Roles = Roles;

  constructor() {
    super();
  }

  async created() {
    // @ts-ignore //noimplany
    Object.keys(rules).forEach(rule => {
      // @ts-ignore //noimplany
      extend(rule, {
        // @ts-ignore //noimplany
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
        // messages[rule], // assign message
      });
    });

    const res: ViewOrderResponse = await this.orderService.hitEndpoint({
      endpoint: EndPoints.orders,
      accessMethod: HttpVerbs.get,
      params: { orderId: parseInt(this.$route.params.id, 10) },
    });
    if (res.totalCount == 0) {
      this.$router.push({ name: "page-not-found" }); //this.$emit('done');
    } else {
      this.order = res.result[0];
      this.regions = await dataService.getRegions();
    }
  }

  //get fullname and publicEntity...
  get fullName() {
    return this.order
      ? `${this.order.recipientFirstName} ${this.order.recipientLastName} (${this.order.publicEntityCode} ${this.order.publicEntityName})`
      : "";
  }

  onSubmit() {
    this.saveOrder("");
  }

  cancelOrder() {
    this.$router.push({ name: "orders" }); //this.$emit('done');
  }
  // @ts-ignore //noimplany
  tooltipTranslate(value, key) {
    return t.t(value, key);
  }

  // @ts-ignore //noimplany
  format = format;
  // @ts-ignore //noimplany
  parseISO = parseISO;

  // @ts-ignore //noimplany
  async createOrderDetails(orderId, productType) {
    const params: PlaceOrderDetailRequest = {
      orderId: orderId,
      productType: productType,
    };

    let result = false;
    result = await this.$confirm(t.t("addNewPackage", "q"));

    if (result) {
      const newDetails = await this.orderService.hitEndpoint({
        endpoint: EndPoints.ordersOrderDetails,
        accessMethod: HttpVerbs.post,
        params: params,
      }); // response is the new id

      // we got a response
      if (newDetails) {
        // @ts-ignore
        const res = await this.orderService.hitEndpoint({
          endpoint: EndPoints.ordersOrderDetails,
          accessMethod: HttpVerbs.get,
          params: { orderDetailId: newDetails },
        });
        // @ts-ignore
        if (res != []) {
          const orderRef = this.order;
          // @ts-ignore //strict
          this.order.orderDetails.push({
            deviceChangeDate: res[0].deviceChangeDate,
            imei: res[0].imei,
            msisdn: res[0].msisdn,
            orderDetailId: res[0].orderDetailId,
            orderId: orderId,
            productType: productType,
            requestId: res[0].requestId,
            status: res[0].status,
          });
          // @ts-ignore //strict
          const targetIndex = orderRef.orderDetailsInfo
            .map(function(item) {
              return item.productType;
            })
            .indexOf(productType);
          // @ts-ignore //strict
          orderRef.orderDetailsInfo[targetIndex].quantity++;
          // @ts-ignore
          superToast(superOk);
        }
      } else {
        // @ts-ignore
        superToast(superNotOk);
      }
    }
    // this.saveOrder("stayOnPage");
  }

  async saveOrder(behavior: string) {
    const updateOrder: ChangeOrderRequest = {
      orderId: this.order.orderId,
      publicEntityCode: this.order.publicEntityCode,
      recipientFirstName: this.order.recipientFirstName,
      recipientLastName: this.order.recipientLastName,
      orderStatus: this.order.orderStatus,
      mobile: this.order.mobile,
      regionalUnitId: this.order.regionalUnitId, // κωδ. νομού
      city: this.order.city,
      postalCode: this.order.postalCode,
      address: this.order.address,
      addressNo: +this.order.addressNo,
      floor: this.order.floor,
      comments: this.order.comments,
    };

    const res = await this.orderService.hitEndpoint({
      endpoint: EndPoints.orders,
      accessMethod: HttpVerbs.put,
      params: updateOrder,
    });

    if (res.length != 0) {
      if (behavior != "stayOnPage") {
        this.$router.push({ name: "orders" }); //this.$emit('done');
      }
      // @ts-ignore
      superToast(superOk);
    } else {
      // @ts-ignore
      superToast(superNotOk);
    }
  }

  // @ts-ignore //noimplany
  filteredBy(_data, _filter) {
    // @ts-ignore //noimplany
    return _data.filter(function(item) {
      return item.productType == _filter;
    });
  }

  // @ts-ignore //noimplany
  disableStatus(_optionValue, _statusValue) {
    return !(
      (_statusValue == OrderStatus.saved &&
        _optionValue == OrderStatus.finalized) ||
      (_statusValue == OrderStatus.notReceived &&
        _optionValue == OrderStatus.cancelled)
    );
  }

  formIsReadOnly() {
    // @ts-ignore //strict
    return this.order.orderStatus != OrderStatus.saved;
  }

  // @ts-ignore //noimplany
  async deleteRequest(_request, _orders) {
    let result = false;
    try {
      //show modal
      result = await this.$confirm(t.t("delete", "q"));
      //if user confirms delete, proceed
      if (result) {
        const filter = {
          orderDetailId: parseInt(_request.orderDetailId, 10),
          orderId: parseInt(_request.orderId, 10),
        };

        const res = await this.orderService.hitEndpoint({
          endpoint: EndPoints.ordersOrderDetails,
          accessMethod: HttpVerbs.delete,
          params: filter,
        });
        if (res) {
          // @ts-ignore
          superToast(superOk);

          let removeIndex = _orders
            // @ts-ignore //noimplany
            .map(function(item) {
              // @ts-ignore //strict
              return item.orderDetailId;
            })
            .indexOf(_request.orderDetailId);
          _orders.splice(removeIndex, 1);

          // @ts-ignore // strict
          removeIndex = this.order.orderDetailsInfo
            .map(function(item) {
              // @ts-ignore //strict
              return item.productType;
            })
            .indexOf(_request.productType);
          // @ts-ignore //strict
          this.order.orderDetailsInfo[removeIndex].quantity--;
        } else {
          // @ts-ignore
          superToast(superNotOk);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
</script>
