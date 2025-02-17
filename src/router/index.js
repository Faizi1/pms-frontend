import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/auth/Login.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: () => import("@/views/dashboard/Dashboard.vue"),
      meta: {
        layout: "full",
        requiresAuth: true,
      },
    },
    {
      path: "/user",
      name: "User",
      component: () => import("@/views/user/User.vue"),
      meta: {
        pageTitle: "User",
        breadcrumb: [
          {
            text: "User",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_user",
      },
    },
    {
      path: "/role",
      name: "Role",
      component: () => import("@/views/role/Role.vue"),
      meta: {
        pageTitle: "Role",
        breadcrumb: [
          {
            text: "Role",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_role",
      },
    },
    {
      path: "/organization",
      name: "Organization",
      component: () => import("@/views/organization/Organization.vue"),
      meta: {
        pageTitle: "Organization",
        breadcrumb: [
          {
            text: "Organization",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_organization",
      },
    },
    // {
    //   path: "/feedback",
    //   name: "Feedback",
    //   component: () => import("@/views/feedback/FeedBack.vue"),
    //   meta: {
    //     pageTitle: "Feedback",
    //     breadcrumb: [
    //       {
    //         text: "Feedback",
    //         active: true,
    //       },
    //     ],
    //     requiresAuth: true,
    //     permission: "show_organization",
    //   },
  // },
    {
      path: "/noc",
      name: "NOC",
      component: () => import("@/views/noc/Noc.vue"),
      meta: {
        pageTitle: "Noc",
        breadcrumb: [
          {
            text: "NOC",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_noc",
      },
    },
    {
      path: "/prefix",
      name: "Prefix",
      component: () => import("@/views/prefix/Prefix.vue"),
      meta: {
        pageTitle: "Prefix",
        breadcrumb: [
          {
            text: "Prefix",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_prefix",
      },
    },
    {
      path: "/rank-type",
      name: "RankType",
      component: () => import("@/views/rankType/RankType.vue"),
      meta: {
        pageTitle: "Rank",
        breadcrumb: [
          {
            text: "Rank",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_rank_type",
      },
    },
    {
      path: "/case",
      name: "Case",
      component: () => import("@/views/case/ChargingRequests.vue"),
      meta: {
        pageTitle: "Charging Request",
        breadcrumb: [
          {
            text: "Charging Request",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_case",
      },
    },
    {
      path: "/all-cases",
      name: "AllCases",
      component: () => import("@/views/allCases/Reservations.vue"),
      meta: {
        pageTitle: "Reservations",
        breadcrumb: [
          {
            text: "Reservations",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_all_cases",
      },
    },
    {
      path: "/marked-cases",
      name: "MarkedCases",
      component: () => import("@/views/markedCase/ParkingSpots.vue"),
      meta: {
        pageTitle: "Parking Spots",
        breadcrumb: [
          {
            text: "Parking Spots",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_marked_cases",
      },
    },
    {
      path: "/ps-1A-cases",
      name: "PS-1A",
      component: () => import("@/views/psCases/Ps1aCases.vue"),
      meta: {
        pageTitle: "PS 1-A Cases",
        breadcrumb: [
          {
            text: "PS 1A",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_ps_1a",
      },
    },
    {
      path: "/ps-1B-cases",
      name: "PS-1B",
      component: () => import("@/views/psCases/Ps1bCases.vue"),
      meta: {
        pageTitle: "PS 1-B Cases",
        breadcrumb: [
          {
            text: "PS 1B",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_ps_1b",
      },
    },
    {
      path: "/ps-1C-cases",
      name: "PS-1C",
      component: () => import("@/views/psCases/Ps1cCases.vue"),
      meta: {
        pageTitle: "PS 1-C Cases",
        breadcrumb: [
          {
            text: "PS 1C",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_ps_1c",
      },
    },
    {
      path: "/awards",
      name: "Award",
      component: () => import("@/views/award/award.vue"),
      meta: {
        pageTitle: "Award",
        breadcrumb: [
          {
            text: "Award",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_awards",
      },
    },
    {
      path: "/organization-child",
      name: "OrganizationChild",
      component: () =>
        import("@/views/organizationChild/OrganizationChild.vue"),
      meta: {
        pageTitle: "Organization Child",
        breadcrumb: [
          {
            text: "Organization Child",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "organization_child_show",
      },
    },
    {
      path: "/OAS-users",
      name: "OASUser",
      component: () =>
        import("@/views/OASUser/OASUser.vue"),
      meta: {
        pageTitle: "OAS Users",
        breadcrumb: [
          {
            text: "OAS Users",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_oas_users",
      },
    },
    {
      path: "/appointment",
      name: "Appointment",
      component: () => import("@/views/appointment/Appointment.vue"),
      meta: {
        pageTitle: "Appointment",
        breadcrumb: [
          {
            text: "Appointment",
            active: true,
          },
        ],
        requiresAuth: true,
        permission: "show_appointment",
      },
    },
    {
      path: "/officer-data",
      name: "OfficerData",
      component: () => import("@/views/officerData/OfficerData.vue"),
      meta: {
        pageTitle: "Officer Basic Data",
        breadcrumb: [
          {
            text: "Officer Data",
            active: true,
          },
        ],
        requiresAuth: true,
      },
    },
    {
      path: "*",
      redirect: "/login",
    }, 
  ],
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
