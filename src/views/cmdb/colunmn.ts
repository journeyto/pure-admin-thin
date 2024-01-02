import { message } from "@/utils/message";
import { ref, computed,reactive,toRaw  } from "vue";

import {
     getServers,
     addServer,
     editServer,
     deleteServer,
} from "@/api/cmdb/server";

// 如果您不习惯tsx写法，可以传slot，然后在template里写
// 需是hooks写法（函数中有return），避免失去响应性
  const search = ref("");

  var rawdata = [];
  // const tableData = reactive([]);
  const getDataList = async () => {
    const res = await getServers();
    // console.log(res);
    // tableData.value = res.data;
    // rawdata = toRaw(tableData);
    rawdata = res.data;
    console.log("rawdata1:",rawdata);
    // console.log(toRaw(tableData);
  }

  const filterTableData = computed(() =>
    rawdata.filter(
      data =>
        !search.value ||
        data.manage_ip.toLowerCase().includes(search.value.toLowerCase()) ||
        data.admin.toLowerCase().includes(search.value.toLowerCase()) ||
        data.group.toLowerCase().includes(search.value.toLowerCase()) 
    )
  );

  console.log("rawdata2:",rawdata);
// let rawdata = [
//       {
//         manage_ip: "192.168.0.1",
//         hostname: "test01",
//         group: "双碳能耗",
//         admin: "管理员01",
//         os_type: "bclinux",
//         os_release: "8.2.2107",
//         asset_type: "虚拟机"
//       },
//       {
//         manage_ip: "192.168.0.2",
//         hostname: "test02",
//         group: "双碳能耗",
//         admin: "管理员02",
//         os_type: "bclinux",
//         os_release: "8.2.2107",
//         asset_type: "虚拟机"
//       },
//       {
//         manage_ip: "192.168.0.3",
//         hostname: "test03",
//         group: "三费",
//         admin: "管理员03",
//         os_type: "bclinux",
//         os_release: "8.2.2107",
//         asset_type: "虚拟机"
//       }
//     ];

  
const columns: TableColumnList = [
      {
        type: "expand",
        slot: "expand"
      },
      {
        label: "IP",
        prop: "manage_ip"
      },
      {
        label: "实例名",
        prop: "hostname"
      },
      {
        label: "项目组",
        prop: "group"
      },
      {
        label: "负责人",
        prop: "admin"
      },
      {
        label: "操作系统",
        prop: "os_type"
      },
      {
        label: "系统版本",
        prop: "os_release"
      }, 
      {
        label: "资产类型",
        prop: "asset_type"
      },   
      {
        label: "操作",
        slot: "operation"
      },
      {
        align: "right",
        headerRenderer: () => (<el-input clearable v-model={ search.value } placeholder="搜索" />)
      }
  ];

    //表单数据
  const formServer = reactive({
      manage_ip: "",
      hostname: "",
      group: "",
      owner: "",
      asset_type: "",
      os_type: "",
      os_release: "",
      cpu_model:"",
      cpu_count:"",
      cpu_core_count:"",
      ram_capacity:"",
      disk_capacity:"",
      bussiness_ip:"",
      net_mask:"",
      ipv6_address:"",
      area:"",
      ssh_user:"",
      ssh_password:"",
      note: ""
  });
  
