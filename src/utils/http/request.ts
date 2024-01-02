import axios from "axios";
import { baseUrlApi } from "@/api/utils";
axios.defaults.withCredentials = true;

// 创建一个axios实例对象
const service = axios.create({ baseUrlApi });

// 在请求之前做一些事情
service.interceptors.request.use(req => {
  const token = window.localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = "jwt " + token;
    //req.headers['X-CSRFToken'] = cookies.parse(document.cookie).csrftoken;
  }
  return req;
});

// 在请求之后做一些事情
service.interceptors.response.use(res => {
  console.dir("服务器返回结果:" + res);

  const { code, data } = res.data;

  //如果服务端返回二进制文件
  if (res.headers["file_type"] == "Blob") {
    let fileName = res.headers["content-disposition"].split("filename=").pop();
    // let typeCount = {type: "application/octet-stream"};
    fileName = decodeURI(fileName);
    const blob = new Blob([res.data], { type: "application/zip" });
    console.log(blob);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    // 根据后端 协商  视情况而定
    if (code == 200) {
      return data;
    }
  }
});

// 封装的核心函数
function request(options) {
  options.method = options.method || "get";
  if (options.method.toLowerCase() == "get") {
    options.params = options.data;
  }

  service.defaults.baseURL = baseUrlApi;
  return service(options);
}
export default request;
