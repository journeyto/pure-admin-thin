import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export type CertResult = {
  code: number;
  msg: string;
};

/** 获取项目信息 */
export const getGroups = (data?: object) => {
  return http.request("get", baseUrlApi("cert/groups"), { data });
};

/** 下载证书 */
export const downloadCert = (data?: object) => {
  const url = baseUrlApi("cert/download/?id=");
  return http.request("get", url.substring(0, url.length - 1) + data.id, {
    responseType: "blob"
  });
};

/** 表格数据 */
export const getCerts = (data?: object) => {
  return http.request("get", baseUrlApi("cert"), { data });
};

/** 添加证书 */
export const addCert = (data?: object) => {
  return http.request<CertResult>(
    "post",
    baseUrlApi("cert"),
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

/** 修改证书 */
export const editCert = (data?: object) => {
  return http.request<CertResult>(
    "put",
    baseUrlApi("cert"),
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};

/** 删除证书 */
export const deleteCert = (data?: object) => {
  return http.request("delete", baseUrlApi("cert"), { data });
};
