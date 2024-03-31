import { localAxios } from "@/util/axios";

const local = localAxios();

function userAddressApt(param, success, fail) {
  local.get(`/apt/useraddress`, { params: param }).then(success).catch(fail);
}

function aptCodeInfo(param, queryParams = {}) {
  // console.log(local.defaults.headers.common["Authorization"]);
  const aptCode = param.aptCode;
  return local.get(`/apt/${aptCode}`, { params: queryParams });
}

function listApt(param, success, fail) {
  const dongCode = param;
  return local.get(`/apt/list/${dongCode}`).then(success).catch(fail);
}

function searchApt(param, success, fail) {
  return local.get(`/apt/search`, { params: param }).then(success).catch(fail);
}

function userHistory(param, success, fail) {
  const userId = param.value.id;
  local.get(`/apt/history/${userId}`).then(success).catch(fail);
}

function userLike(param, success, fail) {
  const userId = param.value.id;
  local.get(`/apt/likelist/${userId}`).then(success).catch(fail);
}

function addLike(param, success, fail) {
  local.get(`/apt/like`, { params: param }).then(success).catch(fail);
}

function removeLike(param, success, fail) {
  local.get(`/apt/remove`, { params: param }).then(success).catch(fail);
}

function listCompApt(param, success, fail) {
  const aptCode = param.aptCode;
  return local.get(`/apt/compare/${aptCode}`, { params: param }).then(success).catch(fail);
}

export {
  userAddressApt,
  aptCodeInfo,
  listApt,
  userHistory,
  userLike,
  addLike,
  removeLike,
  listCompApt,
  searchApt,
};
