import Vue from "vue";
import Router from "vue-router";
import PageNotFound from "../views/page-not-found.vue";
import Login from "../components/login.vue";
import store from "../store"; // your vuex store
import { Roles } from "../shared/modeling/model-common";

Vue.use(Router);
// const parseProps = router: Router => ({ id: parseInt(route.params.id, 10) });

// @ts-ignore //noimplany
const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

// @ts-ignore //noimplany
const ifAuthenticated = (to, from, next) => {
  const authmap: object[] = to.meta.authorize;
  let role: string = store.getters.role;
  // console.log(role);
  if (role === undefined && localStorage.getItem("role") !== null) {
    // @ts-ignore //strict
    role = localStorage.getItem("role");
  }
  if (store.getters.isAuthenticated) {
    // @ts-ignore
    if (authmap.indexOf(role.replace(/\"/g, "")) >= 0) {
      next();
      return;
    } else {
      console.log("noacccess");
      throw new Error("unauthorised");
      // next("/login");
    }
  }
  next("/login");
};

// @ts-ignore //strict
export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      // @ts-ignore //strict
      redirect: to => {
        const role: string = store.getters.role;
        if (role == Roles.admin || role == Roles.userktp) {
          return "/orders";
        } else if (role === Roles.userbodss || role == Roles.userhelpdesk) {
          return "/monitor";
        }
        // the function receives the target route as the argument
        // return redirect path/location here.
      },
      beforeEnter: ifAuthenticated,
      meta: { authorize: [] },
    },
    {
      path: "/orders",
      name: "orders",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin, Roles.userktp, Roles.userbodss, Roles.userhelpdesk] },
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "bundle-orders" */ "../views/orders.vue"),
    },
    {
      path: "/others/search/orderStatus/:orderStatus",
      name: "orders-forwarding",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin, Roles.userbodss] },
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "bundle-orders" */ "../views/orders-forwarding.vue"
        ),
      props: route => ({ orderStatus: parseInt(route.params.orderStatus, 10) }),
    },
    // the route below is part of the orders-forwardinging view. it can later become
    // a separate component
    // {
    //   path: "/files",
    //   name: "files",
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "bundle-orders" */ "../views/orders-files.vue"
    //     ),
    // },
    {
      path: "/orders/new",
      name: "order-new",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin, Roles.userktp] },
      component: () => import("../views/orders-new.vue"),
    },
    {
      path: "/orders/:id",
      name: "order-detail",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin, Roles.userktp, Roles.userbodss, Roles.userhelpdesk] },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "bundle-orders" */ "../views/order-detail.vue"
        ),

      props: route => ({ id: parseInt(route.params.id, 10) }),
    },
    {
      path: "/monitor",
      name: "monitor",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin, Roles.userktp, Roles.userbodss, Roles.userhelpdesk] },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "bunlde-about" */ "../views/orders-monitor.vue"
        ),
    },
    {
      path: "/mass",
      name: "mass",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin, Roles.userktp] },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "bunlde-about" */ "../views/orders-mass.vue"
        ),
    },
    {
      path: "/massImport",
      name: "massImport",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin, Roles.userktp] },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "bunlde-about" */ "../views/mass-import.vue"
        ),
    },
    
    {
      path: "/users/new",
      name: "users-new",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin] },
      component: () => import("../views/users-new.vue"),
    },

    {
      path: "/users/changePassword",
      name: "change-password",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin] },
      component: () => import("../views/change-password.vue"),
    },

    {
      path: "/stats",
      name: "stats",
      beforeEnter: ifAuthenticated,
      meta: { authorize: [Roles.admin, Roles.userktp, Roles.userbodss, Roles.userhelpdesk] },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "bunlde-about" */ "../views/orders-stats.vue"
        ),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "bunlde-about" */ "../views/about.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: "*",
      component: PageNotFound,
    },
  ],
});
