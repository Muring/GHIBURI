<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { registArticle, getModifyArticle, modifyArticle } from "@/api/board";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user-store";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const router = useRouter();
const route = useRoute();

const props = defineProps({ type: String });
const isUseId = ref(false);

const article = ref({
  id: 0,
  title: "",
  contents: "",
  userId: "",
  hit: 0,
  createTime: "",
  modifyDate: "",
});

if (props.type === "modify") {
  let { id } = route.params;
  getModifyArticle(
    id,
    ({ data }) => {
      article.value = data;
      isUseId.value = true;
    },
    (error) => {
      console.log(error);
    }
  );
  isUseId.value = true;
}

const subjectErrMsg = ref("");
const contentErrMsg = ref("");
watch(
  () => article.value.title,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 30) {
      subjectErrMsg.value = "제목을 확인해 주세요!!!";
    } else subjectErrMsg.value = "";
  },
  { immediate: true }
);
watch(
  () => article.value.contents,
  (value) => {
    let len = value.length;
    if (len == 0 || len > 500) {
      contentErrMsg.value = "내용을 확인해 주세요!!!";
    } else contentErrMsg.value = "";
  },
  { immediate: true }
);

function onSubmit() {
  if (subjectErrMsg.value) {
    alert(subjectErrMsg.value);
  } else if (contentErrMsg.value) {
    alert(contentErrMsg.value);
  } else {
    props.type === "regist" ? writeArticle() : updateArticle();
  }
}

function writeArticle() {
  console.log("글등록하자!!", article.value);
  article.value.userId = userInfo.value.id;
  registArticle(
    article.value,
    (response) => {
      let msg = "글등록 처리시 문제 발생했습니다.";
      if (response.status == 201) msg = "글등록이 완료되었습니다.";
      alert(msg);
      moveList();
    },
    (error) => console.log(error)
  );
}

function updateArticle() {
  console.log(article.value.id + "번글 수정하자!!", article.value);
  modifyArticle(
    article.value,
    (response) => {
      let msg = "글수정 처리시 문제 발생했습니다.";
      if (response.status == 200) msg = "글정보 수정이 완료되었습니다.";
      alert(msg);
      moveList();
      // router.push({ name: "article-view" });
      // router.push(`/board/view/${article.value.articleNo}`);
    },
    (error) => console.log(error)
  );
}

function moveList() {
  router.go(-1);
}
</script>

<template>
  <form class="form-box" @submit.prevent="onSubmit">
    <div class="userid-box" v-if="type !== 'regist'">
      <label for="userid" class="">작성자 ID : </label>
      <input
        type="text"
        class="form-control"
        v-model="article.userId"
        :disabled="isUseId"
        placeholder="작성자ID..."
      />
    </div>
    <div class="title-box">
      <label for="subject" class="form-label">제목 : </label>
      <input
        type="text"
        class="title-input"
        v-model="article.title"
        placeholder="제목..."
      />
    </div>
    <div class="content-box">
      <div class="content-title">
        <label for="content">내용 : </label>
      </div>
      <div>
        <textarea v-model="article.contents"></textarea>
      </div>
    </div>
    <div class="btn-box">
      <button type="submit" class="" v-if="type === 'regist'">글작성</button>
      <button type="submit" class="" v-else>글수정</button>
      <button type="button" class="" @click="moveList">목록으로이동...</button>
    </div>
  </form>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";

.form-box {
  border: 1px solid white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  padding: 3% 5% 3% 5%;
  margin: 2% 0 5% 0;
  div {
    margin-bottom: 3%;
  }
}

input {
  padding-left: 1%;
}
.userid-box {
  display: flex;
  text-align: center;
  justify-content: space-around;
  margin-top: 2%;
  label {
    width: 10%;
    padding-top: 1%;
    text-align: left;
  }
  input {
    width: 90%;
    min-height: 40px;
  }
}
.title-box {
  display: flex;
  text-align: center;
  justify-content: space-around;
  label {
    width: 10%;
    padding-top: 1%;
    text-align: left;
  }
  input {
    width: 90%;
    min-height: 40px;
  }
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

.content-box {
  display: block;

  textarea {
    min-height: 200px;
    width: 100%;
    border: 1px solid lightgray;
    border-radius: 10px;
    padding: 2%;
  }
  .content-title {
    margin-bottom: 2%;
  }
}

input {
  border: 1px solid lightgray;
  border-radius: 10px;
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
</style>
