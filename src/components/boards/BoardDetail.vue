<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { detailArticle, deleteArticle } from "@/api/board";

import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user-store";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const route = useRoute();
const router = useRouter();

// const articleno = ref(route.params.articleno);
const { id, menu } = route.params;
const article = ref({});
const boardName = ref("");

console.log(menu);
onMounted(() => {
  getArticle();
  boardName.value = menu === "0" ? "공지사항" : "커뮤니티";
});

const getArticle = () => {
  // const { articleno } = route.params;
  detailArticle(
    id,
    ({ data }) => {
      article.value = data;
    },
    (error) => {
      console.log(error);
    }
  );
};

function moveList() {
  router.push({
    name: menu === "0" ? "notice-list" : "community-list",
  });
}

function moveModify() {
  router.push({ name: "article-modify", params: { id } });
}

function onDeleteArticle() {
  // const { articleno } = route.params;
  deleteArticle(
    id,
    (response) => {
      if (response.status == 200) moveList();
    },
    (error) => {
      console.log(error);
    }
  );
}
</script>

<template>
  <div class="conatiner">
    <div class="main-top">
      <img src="@/assets/image/pngwing-color.png" alt="" />
      <h1>
        <mark>{{ boardName }}</mark>
      </h1>
    </div>
    <div class="article-content">
      <div class="title-box basic-margin">
        <h2>{{ article.id }}. {{ article.title }}</h2>
        <button type="button" class="" @click="moveList">글목록</button>
      </div>
      <div>
        <div class="user-info-box basic-margin">
          <img class="" src="@/assets/image/pngwing.png" />
          <div class="user-box">
            <p class="user">{{ article.userId }}</p>
            <div class="article-info">
              <p class="user">{{ article.createTime }} 조회 : {{ article.hit }}</p>
            </div>
          </div>
        </div>
        <div class="content-box basic-margin">
          {{ article.contents }}
        </div>
        <div v-if="userInfo == null"></div>
        <div class="btn-box" v-else-if="userInfo.permission === 1 || userInfo.id == article.userId">
          <button type="button" class="" @click="moveModify" v-if="userInfo.id == article.userId">
            글수정
          </button>
          <button type="button" class="" @click="onDeleteArticle">글삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";
.main-top {
  display: flex;
  padding-bottom: 2%;
  margin-top: 5%;
  img {
    width: 50px;
    min-height: 50px;
    margin: 1%;
  }
  h1 {
    margin-top: 2%;
  }
}
.article-content {
  border: 1px solid white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  padding: 5%;
  margin: 0 0 5% 0;
}
.title-box {
  display: flex;
  justify-content: space-between;
}
.basic-margin {
  margin-bottom: 5%;
}

.btn-box {
  display: flex;
  justify-content: center;
  button {
    margin: 0 2% 0 2%;
  }
}

button {
  display: block;
  color: $primary-color;
  background-color: white;
  border: 1px solid $primary-color;
  border-radius: 10px;
  min-width: 80px;
  text-align: center;
  padding: 1%;
}
button:hover {
  background-color: $hover-color;
  color: white;
  border-left-color: $primary-color;
  transition-duration: 0.5s;
  cursor: pointer;
}
.user-info-box {
  display: flex;
  width: 100%;
  .user-box {
    display: flex;
    margin: 1% 0 0 1%;
    width: 100%;
    justify-content: space-between;
    .user {
      margin-left: 1%;
    }
    .article-info {
      display: flex;
      width: 130px;
      justify-content: space-between;
    }
  }
}

img {
  width: 4%;
  height: 2%;
}

.content-box {
  min-height: 400px;
  border: 1px solid lightgray;
  border-radius: 10px;
  padding: 5%;
}
</style>
