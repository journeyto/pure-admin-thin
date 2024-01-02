<script setup lang="ts">
  defineOptions({
    // name 作为一种规范最好必须写上并且和路由的name保持一致
    name: "Server"
  });

  import { ref, reactive, onMounted, computed, render, h } from "vue";
  import { PureTable } from "@pureadmin/table";
  import { getGroups } from "@/api/cert";
  import {
     getServers,
     addServer,
     editServer,
     deleteServer,
  } from "@/api/cmdb/server";
  import { message } from "@/utils/message";
  import { useColumns } from "./columns";

  import type { PaginationProps } from "@pureadmin/table";

  const parentBorder = ref(false);
  const childBorder = ref(false);
  const { columns,formServer, filterTableData, getDataList } = useColumns();

  const isDialogShow = ref(false);



  //属组数据
  const tgroups = ref([]);

  //对话框标题
  const action = ref("add");

  // 设置请求头
  const headers = {
      "Content-Type": "multipart/form-data"
  };

  const ServerForm = ref <FormInstance>();

  function handleEdit(row) {
    console.log(row);

  }

  const props = withDefaults(
      defineProps < {
        height?: string;
      } > (),
      {
        height: "500px"
        // height: null
      }
    );

  /** 分页配置 */
    const pagination = reactive < PaginationProps > ({
      pageSize: 200,
      currentPage: 1,
      pageSizes: [200, 500, 1000],
      total: 50,
      align: "left",
      background: true,
      small: false
    });

  //获取属组信息
    const getGroupinfo = async () => {
      const res = await getGroups();
      tgroups.value = res.data;
    };


  
  function handleAdd() {
      action.value = "add";
      isDialogShow.value = true;
  }
  
  //取消上传
    const cancelAdd = (formEl: FormInstance | undefined) => {
      // if (!formEl) return
      isDialogShow.value = false;
      formEl.resetFields();
    };

  //提单表单
  const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    if (action.value == "add") {

      // 封装请求参数params
      // const params = new FormData();
      // params.append("manage_ip", formServer.manage_ip);
      // params.append("hostname", formServer.manage_ip);
      // params.append("group", formServer.group);
      // params.append("owner", formServer.owner);
      // params.append("os_type", formServer.os_type);

      //请求后台处理
      const res = await addServer(formServer);
      if (res.code == 200) {
        message("添加成功", { type: "success" });
        //重置表单
        formEl.resetFields();
        isDialogShow.value = false;
        getCertList();
      }else{
        message("添加失败", { type: "error" });
      }

    }
  }

  onMounted(() => {
    // getDataList();
  });

</script>

<template>
  <div>
    <el-button type="primary" class="mb-[20px] float-right" @click="handleAdd()">
      录入
    </el-button>
    <pure-table
    :data = "
          filterTableData.slice(
            (pagination.currentPage - 1) * pagination.pageSize,
            pagination.currentPage * pagination.pageSize
          )
        "
    :columns="columns" 
    :border="parentBorder"
    :pagination="pagination">
      <template #operation="{ row }">
        <el-button link type="primary" size="default" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="primary" size="default" @click="handleEdit(row)">禁用</el-button>
      </template>
      <template #expand="{ row }">
        <div class="m-8">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card shadow="hover">  
                  <el-row><el-text size="large" tag="b">CPU型号：</el-text> <el-text size="large" class="mx-1" type="warning">Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz</el-text></el-row>
                  <el-row>
                    <el-text size="large" tag="b">CPU物理个数：</el-text> <el-text size="large" class="mx-1" type="warning">1</el-text>
                  </el-row>
                  <el-row>
                    <el-text size="large" tag="b">CPU逻辑核数：</el-text> <el-text size="large" class="mx-1" type="warning">8</el-text>
                  </el-row>
                  <el-row>
                    <el-text size="large" tag="b">内存(G)： </el-text> <el-text size="large" class="mx-1" type="warning">32</el-text>
                  </el-row>
                  <el-row>
                    <el-text size="large" tag="b">硬盘(G)：</el-text> <el-text size="large" class="mx-1" type="warning">200</el-text>
                  </el-row>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="hover"> 
                  <el-row>
                    <el-text size="large" tag="b">业务承载IP：</el-text> <el-text size="large" class="mx-1" type="warning">10.15.2.29</el-text>
                  </el-row>
                  <el-row>
                    <el-text size="large" tag="b">掩码：</el-text> <el-text size="large" class="mx-1" type="warning">28</el-text>
                  </el-row>
                  <el-row>
                    <el-text size="large" tag="b">IPV6：</el-text> <el-text size="large" class="mx-1" type="warning">fe80::42:3eff:fed4:c711</el-text>
                  </el-row>
                  <el-row>
                    <el-text size="large" tag="b">区域：</el-text> <el-text size="large" class="mx-1" type="warning">呼池2期</el-text>
                  </el-row>
                  <el-row>
                    <el-text size="large" tag="b">ssh用户：</el-text> <el-text size="large" class="mx-1" type="warning">app</el-text>
                  </el-row>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </template>
      
    </pure-table>

    <el-dialog
    v-model="isDialogShow"
    width="50%"
    :title="action == 'add' ? '录入记录' : '编辑记录'"
    >
    <div class="el-dialog-div">
      <el-form :inline="false" :model="formServer" ref="ServerForm">
        <el-row>
          <el-form-item label="IP:" label-width="120px" prop="manage_ip" 
          :rules="[{ required: true, message: '必填项', trigger: 'blur' }]"
          >
            <el-input v-model="formServer.manage_ip" placeholder="请输入IP" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="实例名:" label-width="120px" prop="hostname" 
          :rules="[{ required: true, message: '必填项', trigger: 'blur' }]"
          >
            <el-input v-model="formServer.hostname" placeholder="实例名" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="项目:" label-width="120px" prop="group" 
          
          >
            <el-select placeholder="请选择" v-model="formServer.group">
              <el-option v-for="item in tgroups" :label="item.name" :value="item.id" :key="item.id" />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="负责人:" label-width="120px" prop="owner" 
          
          >
            <el-input v-model="formServer.owner" placeholder="负责人" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="操作系统:" label-width="120px" prop="os_type" 
          
          >
            <el-input v-model="formServer.os_type" placeholder="操作系统(centos7/8)" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="操作系统版本:" label-width="120px" prop="os_release" 
          
          >
            <el-input v-model="formServer.os_release" placeholder="操作系统版本" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="资产类型:" label-width="120px" prop="asset_type"
            
            >
            <el-input v-model="formServer.asset_type" placeholder="资产类型" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="CPU型号:" label-width="120px" prop="cpu_model"
           
            >
            <el-input v-model="formServer.cpu_model" placeholder="CPU型号" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="CPU物理个数:" label-width="120px" prop="cpu_count"
            
            >
            <el-input v-model="formServer.cpu_count" placeholder="CPU物理个数" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="CPU逻辑核数:" label-width="120px" prop="cpu_core_count"
           
            >
            <el-input v-model="formServer.cpu_core_count" placeholder="CPU逻辑核数" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="内存容量(G):" label-width="120px" prop="ram_capacity"
            
            >
            <el-input v-model="formServer.ram_capacity" placeholder="内存容量" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="硬盘容量(G):" label-width="120px" prop="disk_capacity"
            
            >
            <el-input v-model="formServer.disk_capacity" placeholder="硬盘容量" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="业务承载IP:" label-width="120px" prop="bussiness_ip">
            <el-input v-model="formServer.bussiness_ip" placeholder="业务承载IP" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="掩码:" label-width="120px" prop="net_mask">
            <el-input v-model="formServer.net_mask" placeholder="掩码" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="IPV6:" label-width="120px" prop="ipv6_address">
            <el-input v-model="formServer.ipv6_address" placeholder="IPV6" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="区域:" label-width="120px" prop="area">
            <el-input v-model="formServer.area" placeholder="区域" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ssh用户:" label-width="120px" prop="ssh_user">
            <el-input v-model="formServer.ssh_user" placeholder="ssh用户" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="ssh密码:" label-width="120px" prop="ssh_password">
            <el-input v-model="formServer.ssh_password" placeholder="ssh密码" clearable />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:" label-width="120px" prop="note">
            <el-input v-model="formServer.note" placeholder="备注" clearable />
          </el-form-item>
        </el-row>
        <el-row style="justify-content: center">
          <el-form-item>
            <span>
              <el-button @click="cancelAdd(ServerForm)">取消</el-button>
              <el-button @click="onSubmit(ServerForm)" type="primary">确认</el-button>
            </span>
          </el-form-item>
        </el-row>
      </el-form>
      </div>
    </el-dialog>
  </div>
</template>


<style>
  .el-row {
    margin-bottom: 20px;
  }

  .el-row:last-child {
    margin-bottom: 0;
  }

  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .el-dialog-div{
    height: 70vh;
    overflow: auto;
  }
</style>