<script setup lang="ts">
defineOptions({
  // name必须写上并且和路由的name保持一致
  name: "Cert"
});
import { ref, reactive, onMounted } from "vue";
import { PureTable } from "@pureadmin/table";
import {
  getGroups,
  getCerts,
  addCert,
  editCert,
  deleteCert,
  downloadCert
} from "@/api/cert";
import { downloadByUrl} from "@pureadmin/utils";
import { message } from "@/utils/message";
import type { FormInstance } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";


//对话框标题
const action = ref("add");

const props = withDefaults(
  defineProps<{
    height?: string;
  }>(),
  {
    height: "500px"
    // height: null
  }
);

// 设置请求头
const headers = {
  "Content-Type": "multipart/form-data"
};

const UploadForm = ref<FormInstance>();

//上传的文件
const fileUpload = ref();

const columns: TableColumnList = [
  {
    label: "域名",
    prop: "name",
    width: "150",
    fixed: true
  },
  {
    label: "所属项目",
    prop: "group",
    width: "150"
  },
  {
    label: "证书申请时间",
    prop: "crt_create_time",
    width: "150"
  },
  {
    label: "证书到期时间",
    prop: "crt_expire_time",
    width: "150"
  },
  {
    label: "剩余天数",
    prop: "remain_days",
    width: "150"
  },
  {
    label: "备注",
    prop: "note",
    width: "240"
  },
  {
    label: "操作",
    width: "180",
    fixed: "right",
    slot: "operation"
  }
];

const isDialogShow = ref(false);

//表单数据
const formCert = reactive({
  name: "",
  group: "",
  note: "",
  filepath: "",
  group_id:""
});

//属组数据
const tgroups = ref([]);

//表格数据
const certList = ref([]);

//表单的域名字段是否可编辑
const isEditedable = ref(true);

//添加证书
function clickAdd(){
  action.value = "add";
  isEditedable.value = false;
  isDialogShow.value = true;
}

//编辑的数据ID
const rowid = ref();

/** 分页配置 */
const pagination = reactive<PaginationProps>({
  pageSize: 50,
  currentPage: 1,
  pageSizes: [50, 100, 200],
  total: 1,
  align: "left",
  background: true,
  small: false
});

//获取属组信息
const getGroupinfo = async () => {
  const res = await getGroups();
  tgroups.value = res.data;
};

//获取list信息
const getCertList = async () => {
  const res = await getCerts();
  certList.value = res.data;
  pagination.total = certList.value.length;
};

// 上传文件之前的钩子函数
const beforeFileUpload = file => {
  // let isZip = file.name.endsWith('.zip');
  // let isZip = file.type.includes('zip');
  // if (!isZip) {
  //     return false;
  // }

  return true;
};

// 选择文件时被调用，将他赋值给fileUpload,并且限制文件的后缀和大小
const handleChange = file => {
  fileUpload.value = file;
  //限制文件的类型
  const fileName = file.name;
  const uid = file.uid;
  const pos = fileName.lastIndexOf(".");
  const lastName = fileName.substring(pos, fileName.length);
  if (lastName.toLowerCase() !== ".zip") {
    message("只能上传zip格式的文件!", { type: "error" });
    return false;
  }

  //限制文件的大小为5kb到15kb之间
  const isLt = file.size / 1024 / 5 >= 1 && file.size / 1024 / 15 <= 1;
  if (!isLt) {
    message("文件大小必须介于5kb和15kb之间!", { type: "error" });
    return false;
  }
};

// 提交数据
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // 域名和属组必须选择
  if (!formCert.name || !formCert.group) {
    message("请填写必填项", { type: "error" });
    return false;
  }
  if (action.value == "add") {
    // 判断是否上传了证书文件
    if (typeof fileUpload.value == "undefined") {
      message("请上传证书文件!", { type: "error" });
      return false;
    }

    // 封装请求参数params
    const params = new FormData();
    params.append("name", formCert.name);
    params.append("group", formCert.group);
    params.append("note", formCert.note);
    params.append("file", fileUpload.value.raw);
    console.log("post 请求参数为:", formCert, params)
    //请求后台处理
    const res = await addCert(params);
    if (res.code == 200) {
      message("添加成功", { type: "success" });
      //重置表单
      formEl.resetFields();
      fileUpload.value = null;
      isDialogShow.value = false;
      getCertList();
    } else {
      message("添加失败", { type: "error" });
    }
  } else if (action.value == "edit") {
    isEditedable.value = true;
    const editparams = new FormData();
    editparams.append("id", rowid.value);
    editparams.append("name", formCert.name);
    editparams.append("group", formCert.group);
    editparams.append("note", formCert.note);
    if (typeof fileUpload.value == "undefined") {
      console.log("没有选择文件");
    } else {
      console.log("选择了文件", fileUpload.value.raw);
      editparams.append("file", fileUpload.value.raw);
    }

    const res = await editCert(editparams);
    if (res.code == 200) {
      message("修改成功", { type: "success" });
      formEl.resetFields();
      UploadForm.value.resetFields();
      isDialogShow.value = false;
      getCertList();
    } else {
      message("修改失败", { type: "success" });
    }
  }
};

//取消上传
const cancelUpload = (formEl: FormInstance | undefined) => {
  // if (!formEl) return
  isDialogShow.value = false;
  formEl.resetFields();
};

async function handleDelete(row) {
  const res = await deleteCert(row.id);
  if (res.code == 200) {
    message("删除成功", { type: "success" });
    getCertList();
  }
}

function handleEdit(row) {
  action.value = "edit";
  rowid.value = row.id;
  isDialogShow.value = true;
  isEditedable.value = true;
  Object.assign(formCert, row);
  formCert.group = row.group_id;
}


async function handleDownload(row) {
  const res = await downloadCert(row);
}

onMounted(() => {
  getGroupinfo();
  getCertList();
});

</script>

<template>
  <div>
    <el-card shadow="never">
      <el-button
        type="primary"
        class="mb-[20px] float-right"
        @click="clickAdd()"
      >
        新增证书
      </el-button>
      <pure-table
        :data="
          certList.slice(
            (pagination.currentPage - 1) * pagination.pageSize,
            pagination.currentPage * pagination.pageSize
          )
        "
        :columns="columns"
        :height="props.height"
        :pagination="pagination"
        border
      >
        <template #operation="{ row }">
          <el-popconfirm
            :title="`是否确认删除这条数据?`"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button link type="primary" size="default"> 删除 </el-button>
            </template>
          </el-popconfirm>
          <el-button link type="primary" size="default" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            link
            type="primary"
            size="default"
            @click="handleDownload(row)"
            >下载</el-button
          >
        </template>
      </pure-table>
    </el-card>

    <el-dialog
      v-model="isDialogShow"
      width="40%"
      :title="action == 'add' ? '新增证书' : '编辑记录'"
    >
      <el-form :inline="false" :model="formCert" ref="UploadForm">
        <el-row>
          <el-form-item
            label="域名:"
            prop="name"
            :rules="[{ required: true, message: '必填项', trigger: 'blur' }]"
            
          >
            <el-input
              v-model="formCert.name"
              placeholder="请输入域名"
              clearable
              :disabled="isEditedable"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="项目:"
            prop="group"
            :rules="[{ required: true, message: '必填项', trigger: 'blur' }]"
          >
            <el-select placeholder="请选择" v-model="formCert.group">
              <el-option
                v-for="item in tgroups"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注信息:" class="note">
            <el-input
              :rows="3"
              v-model="formCert.note"
              placeholder="备注信息"
              type="textarea"
              clearable
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-upload
            class="upload-container"
            action="#"
            :show-file-list="true"
            :limit="1"
            :auto-upload="false"
            ref="upload"
            :before-upload="beforeFileUpload"
            accept=".zip"
            :on-change="handleChange"
            :headers="headers"
          >
            <template #trigger>
              <el-icon class="avatar-uploader-icon"> <Plus /><span /> </el-icon>
            </template>
            <template #tip>
              <div class="el-upload__tip text-red">
                <el-text class="mx-1" size="small" type="warning">
                  *请上传zip格式
                </el-text>
              </div>
            </template>
          </el-upload>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <span>
              <el-button @click="cancelUpload(UploadForm)">取消</el-button>
              <el-button @click="onSubmit(UploadForm)" type="primary"
                >确认</el-button
              >
            </span>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
