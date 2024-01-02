export default {
  path: "/cmdb/",
  redirect: "/cmdb/server",
  meta: {
    icon: "informationLine",
    title: "资产管理",
    //showLink: false,
    rank: 2
  },
  children: [
    {
      path: "/cmdb/server",
      name: "Server",
      component: () => import("@/views/cmdb/server.vue"),
      meta: { title: "服务器" }
    },
    {
      path: "/cmdb/network",
      name: "NetworkDevice",
      component: () => import("@/views/cmdb/network.vue"),
      meta: { title: "网络设备" }
    }
  ]
} as RouteConfigsTable;
