import { localAxios } from "@/util/axios";

const local = localAxios();

async function userLogin(param, success, fail) {
  await local.post("/user/login", param).then(success).catch(fail);
}

async function userLogout(success, fail) {
  await local.delete("/user/logout").then(success).catch(fail);
}

async function userWithdraw(success, fail) {
  await local.delete("/user/withdraw").then(success).catch(fail);
}

async function userSignup(param, success, fail) {
  await local.post("/user/signup", param).then(success).catch(fail);
}

async function userIdCheck(param, success, fail) {
  await local.get(`/user/idCheck`, { params: param }).then(success).catch(fail);
}

export { userLogin, userLogout, userWithdraw, userSignup, userIdCheck, local };
