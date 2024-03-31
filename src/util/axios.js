import axios from "axios";
import { httpStatusCode } from "./http-status";

const { VITE_GHIBURI_URL } = import.meta.env;

export function localAxios() {
  const instance = axios.create({
    baseURL: VITE_GHIBURI_URL,
    withCredentials: true,
  });
  //Request 발생 시 적용할 내용
  instance.defaults.headers.common["Authorization"] = "";
  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers.put["Content-Type"] = "application/json";

  // request, response 시 설정한 내용을 적용한다.
  instance.interceptors.request.use((config) => {
    return config;
  }),
    (error) => {
      return Promise.reject(error);
    };

  let isTokenRefreshing = false;

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      //새로고침에 의해 저장된 accessToken이 없어진 경우
      if (status == httpStatusCode.UNAUTHORIZED) {
        // 요청상태저장
        const originalRequest = config;

        //token을 재발급 하는 동안 다른 요청이 발생할 경우 대기시킨다.

        if (!isTokenRefreshing) {
          isTokenRefreshing = true;
          // 에러가 발생했던 컴포넌트의 axios로 이동하고자 하는 경우
          // 반드시 return을 붙여야 한다.
          return await instance.post("/silent-refresh").then((response) => {
            const newAccessToken = response.data.Authorization;

            instance.defaults.headers.common["Authorization"] = newAccessToken;
            originalRequest.headers.Authorization = newAccessToken;

            isTokenRefreshing = false;

            return instance(originalRequest);
          });
        }
      } else if (status == httpStatusCode.FORBIDDEN) {
        alert(error.response.data.message);
      }
      return Promise.reject(error);
    }
  );
  return instance;
}
