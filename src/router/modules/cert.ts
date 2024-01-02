export default {
  path: "/cert",
  redirect: "/cert/index",
  meta: {
    title: "证书管理",
    icon: "dashicons:admin-site-alt3",
    rank: 1
  },
  children: [
    {
      path: "/cert/index",
      name: "Cert",
      component: () => import("@/views/cert/index.vue"),
      meta: {
        title: "证书管理"
      }
    }
  ]
};