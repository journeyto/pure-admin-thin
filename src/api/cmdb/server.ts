import { http } from "@/utils/http";
import { baseUrlApi } from "../utils";

export type CertResult = {
  code: number;
  msg: string;
};

/** 表格数据 */
export const getServers = (data?: object) => {
  return http.request("get", baseUrlApi("cmdb/server"), { data });
};

/** CMDB 添加数据 */
export const addServer = (data?: object) => {
  return http.request<CertResult>("post", baseUrlApi("cmdb/server"), { data });
};

/** CMDB 修改数据 */
export const editServer = (data?: object) => {
  return http.request<CertResult>("put", baseUrlApi("cmdb/server"), { data });
};

/** CMDB 删除数据 */
export const deleteServer = (data?: object) => {
  return http.request("delete", baseUrlApi("cmdb/server"), { data });
};
