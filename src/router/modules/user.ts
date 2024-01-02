export default {
  path: "/user/",
  redirect: "/user/info",
  meta: {
    icon: "informationLine",
    title: "个人中心",
    rank: 12
  },
  children: [
    {
      path: "/user/info",
      name: "UserProfile",
      component: () => import("@/views/user/index.vue"),
      meta: { title: "个人信息" }
    },
    {
      path: "/user/password",
      name: "UserPassword",
      component: () => import("@/views/user/password.vue"),
      meta: { title: "修改密码" }
    }
  ]
} as RouteConfigsTable;
