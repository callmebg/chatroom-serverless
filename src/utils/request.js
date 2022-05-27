import axios from "axios";
import { Message } from "element-ui";
import { getCookie } from "./token";
let instance = axios.create({
  timeout: 3000,
  baseURL: process.env.API_URL
});

instance.interceptors.request.use(
  config => {
    const token = getCookie();
    if (token) { // 若存在token，将token添加至请求头
      config.headers.Authorization = token;
    }
    return config;
  },
  err => {
    Promise.reject(err);
  }
);

instance.interceptors.response.use(
  response => {
      console.log(response)
      if(!response.data.success) { // 若业务逻辑不成功，给出提示
        Message({
          message: response.data.message,
          type: "warning",
          duration: 3000
        });
      }
    return response;
  },
  error => {
    console.log("请求错误", error);
    Message({
      message: "服务器内部错误，请稍后重试！",
      type: "error",
      duration: 3000
    });
    return Promise.reject(error);
  }
);

export default instance;
