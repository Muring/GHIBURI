import { localAxios } from "@/util/axios";

const local = localAxios();

function listNews(param, success, fail) {
  local.get(`/news/list`, { params: param }).then(success).catch(fail);
}

function mainNews(success, fail) {
  local.get(`/news/main`).then(success).catch(fail);
}
export { listNews, mainNews };
