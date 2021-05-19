<template>
  <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
    <form ref="form" @submit.prevent="handleSubmit(onSubmit)">
      <div class="content-container">
        <div class="columns">
          <div class="column">
            <div class="section content-title-group">
              <h2 class="title">
                <i class="fas fa-plus-square"></i>
                {{ "newUser" | t }}
                <span
                  class="delete is-medium is-right"
                  style="float: right;"
                  @click="cancelUser"
                ></span>
              </h2>

              <div class="card">
                <div class="card-content">
                  <div class="content has-text-left">
                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="username"
                          >{{ "username" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyLatinAlphaNumCaps"
                              :name="'username' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="3"
                                maxlength="50"
                                class="input"
                                name="username"
                                v-model="user.username"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="password"
                          >{{ "password" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyLatinAlphaNumCaps"
                              :name="'password' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="password"
                                minlength="7"
                                maxlength="50"
                                class="input"
                                name="password"
                                v-model="user.password"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="userRoleId"
                          >{{ "userRoleId" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider v-slot="{ errors }">
                              <div class="control">
                                <div class="select">
                                  <select
                                    required
                                    :name="'userRoleId' | t"
                                    v-model="user.userRoleId"
                                  >
                                    <option
                                      v-for="role in roles"
                                      :value="role.userRoleId"
                                      :key="role.userRoleId"
                                      >{{ role.title }}</option
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
                        <label class="label" for="firstName"
                          >{{ "userFirstName" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              :name="'userFirstName' | t"
                              rules="onlyGreekCaps"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="3"
                                maxlength="20"
                                class="input"
                                name="firstName"
                                v-model="user.firstName"
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
                          >{{ "userLastName" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyGreekCaps"
                              :name="'userLastName' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="text"
                                minlength="3"
                                maxlength="50"
                                class="input"
                                name="lastName"
                                v-model="user.lastName"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="email"
                          >{{ "email" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              :name="'email' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="email"
                                minlength="3"
                                maxlength="80"
                                class="input"
                                name="email"
                                v-model="user.email"
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
                          >{{ "userMobile" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              rules="onlyGreekMobile"
                              :name="'userMobile' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="number"
                                minlength="10"
                                maxlength="10"
                                class="input"
                                name="mobile"
                                v-model="user.mobile"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label">
                        <label class="label" for="telephone"
                          >{{ "userTelephone" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              :name="'userTelephone' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                type="number"
                                minlength="10"
                                maxlength="10"
                                class="input"
                                name="telephone"
                                v-model="user.telephone"
                              />
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="field is-horizontal">
                      <div class="field-label" valign="top">
                        <label class="label" for="isActive"
                          >{{ "active" | t }}:</label
                        >
                      </div>
                      <div class="field-body">
                        <div class="field">
                          <div class="control">
                            <validation-provider
                              :name="'active' | t"
                              v-slot="{ errors }"
                            >
                              <input
                                required
                                type="radio"
                                value="true"
                                name="isActive"
                                v-model="user.isActive"
                              />
                              {{ "yes" | t }}
                              <input
                                required
                                name="isActive"
                                type="radio"
                                value="false"
                                v-model="user.isActive"
                              />
                              {{ "no" | t }}
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
                            <validation-provider v-slot="{ errors }">
                              <textarea
                                class="textarea"
                                :placeholder="'comments' | t"
                                maxlength="100"
                                name="comments"
                                v-model="user.comments"
                              ></textarea>
                              <span class="is-error">{{ errors[0] }}</span>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <footer class="card-footer">
                  <span
                    @click="cancelUser"
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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// @ts-ignore
import { dataService } from "../shared";
import { toast as superToast } from "bulma-toast";
import { extend } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import { messages } from "vee-validate/dist/locale/el.json";
import { configure } from "vee-validate";
import { ValidationObserver } from "vee-validate";
import { ValidationProvider } from "vee-validate";
import { langService as t } from "../shared/lang.service";
import { superOk, superNotOk } from "../shared/constants-toast";
import { AddUserRequest } from "../shared/modeling/model-requests";

// just to commit

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
  },

  filters: {
    t: function(value: string) {
      return t.t(value);
    },
  },
})
export default class UsersNew extends Vue {
  message = "";
  checkReq = false;
  user = {
    userId: "",
    username: null,
    password: null,
    userRoleTitle: null,
    userRoleId: 1,
    lastName: null,
    firstName: null,
    email: null,
    mobile: null,
    telephone: null,
    isActive: true,
    comments: null,
  };
  roles = [];
  dataService = dataService;

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
    this.roles = await this.dataService.getUserRoles();
  }

  onSubmit() {
    // @ts-ignore
    this.submit(this.user);
  }

  cancelUser() {
    this.$router.push({ name: "users" }); //this.$emit('done');
  }

  async submit(user: AddUserRequest) {
    const res = await dataService.getNewUser(user);
    if (res != null) {
      this.user = {
        userId: "",
        username: null,
        password: null,
        userRoleTitle: null,
        userRoleId: 1,
        lastName: null,
        firstName: null,
        email: null,
        mobile: null,
        telephone: null,
        isActive: true,
        comments: null,
      };
      // @ts-ignore
      this.$refs.observer.reset();
      // @ts-ignore
      superToast(superOk);
    } else {
      // @ts-ignore
      superToast(superNotOk);
    }
  }
}
</script>
