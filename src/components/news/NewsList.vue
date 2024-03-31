<script setup>
import { ref, onMounted } from "vue";
import { listNews } from "@/api/news.js";

import VSelect from "@/components/common/VSelect.vue";
import NewsListItem from "@/components/news/item/NewsListItem.vue";
import VPageNavigation from "@/components/common/VPageNavigation.vue";

const selectOption = ref([
  { text: "검색조건", value: "" },
  { text: "글번호", value: "id" },
  { text: "제목", value: "title" },
]);

const articles = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  key: "",
  word: "",
});

onMounted(() => {
  getNewsList();
});

const changeKey = (val) => {
  param.value.key = val;
};

const getNewsList = () => {
  listNews(
    param.value,
    ({ data }) => {
      console.log("I'm In!!");
      articles.value = data;
      currentPage.value = data.currentPage;
      totalPage.value = data.totalPageCount;
      console.log(data);
    },
    (error) => {
      console.log(error);
    }
  );
};

const onPageChange = (val) => {
  currentPage.value = val;
  param.value.pgno = val;
  getNewsList();
};
</script>

<template>
  <div class="container">
    <div class="main-top">
      <img src="@/assets/image/pngwing-color.png" alt="" />
      <h1><mark>뉴스</mark></h1>
    </div>
    <div class="board-box">
      <div class="table-box">
        <table>
          <thead>
            <tr>
              <th scope="col">제목</th>
            </tr>
          </thead>
          <tbody>
            <NewsListItem
              v-for="article in articles"
              :key="article.id"
              :article="article"
            ></NewsListItem>
          </tbody>
        </table>
      </div>
      <VPageNavigation
        :current-page="currentPage"
        :total-page="totalPage"
        @pageChange="onPageChange"
      ></VPageNavigation>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "src/assets/scss/board.scss";
.main-top {
  display: flex;
  margin-bottom: 5%;
  border-bottom: 1px solid lightgray;
  padding-bottom: 2%;
  img {
    width: 50px;
    min-height: 50px;
    margin: 1%;
  }
  h1 {
    margin-top: 2%;
  }
}
.table-top {
  width: 100%;
  display: inline-flex;
  justify-content: end;
  margin-bottom: 1%;
}
.btn-box {
  width: 12%;
  .register-btn {
    padding: 8%;
    background-color: $primary-color;
    border: 1px solid $primary-color;
    color: white;
    border-radius: 10px;
    min-width: 60px;
  }
  :hover {
    background-color: $hover-color;
    border: 1px solid $hover-color;
    color: white;
    border-left-color: $primary-color;
    transition-duration: 0.5s;
    cursor: pointer;
  }
}
.input-form {
  display: flex;
  justify-content: space-between;

  .input-box {
    height: 100%;
    display: flex;

    input {
      border: 1px solid $primary-color;
      border-radius: 10px;
      margin: 0 2% 0 2%;
      padding: 0 2% 0 2%;
    }

    input:focus {
      outline: 1px solid $primary-color;
    }
    .search-btn {
      display: block;
      color: white;
      background-color: $primary-color;
      border: 1px solid $primary-color;
      border-radius: 10px;
      width: 60px;
      text-align: center;
      img {
        width: 80%;
        color: white;
      }
    }
    .search-btn:hover {
      background-color: $hover-color;
      border: 1px solid $hover-color;
      color: white;
      border-left-color: $primary-color;
      transition-duration: 0.5s;
      cursor: pointer;
    }
  }
}
</style>
