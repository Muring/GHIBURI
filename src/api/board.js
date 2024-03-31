import { localAxios } from "@/util/axios";

const local = localAxios();

function listArticle(param, success, fail) {
  local.get(`/board/list`, { params: param }).then(success).catch(fail);
}

function listNotice(param, success, fail) {
  local.get(`/board/notice`, { params: param }).then(success).catch(fail);
}

function recentList(success, fail) {
  local.get(`/board/recent`).then(success).catch(fail);
}

function detailArticle(articleno, success, fail) {
  local.get(`/board/view/${articleno}`).then(success).catch(fail);
}

function registArticle(article, success, fail) {
  console.log("boardjs article", article);
  local.post(`/board/write`, JSON.stringify(article)).then(success).catch(fail);
}

function getModifyArticle(articleno, success, fail) {
  local.get(`/board/modify/${articleno}`).then(success).catch(fail);
}

function modifyArticle(article, success, fail) {
  local.put(`/board/modify`, JSON.stringify(article)).then(success).catch(fail);
}

function deleteArticle(articleno, success, fail) {
  local.delete(`/board/remove/${articleno}`).then(success).catch(fail);
}

export {
  listArticle,
  listNotice,
  recentList,
  detailArticle,
  registArticle,
  getModifyArticle,
  modifyArticle,
  deleteArticle,
};
