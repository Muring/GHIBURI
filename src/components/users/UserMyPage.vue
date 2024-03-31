<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user-store";

import RecommendComponent from "../recommendation/RecommendComponent.vue";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
</script>

<template>
  <div class="container">
    <div class="title-box">
      <img src="@/assets/image/pngwing-color.png" alt="" />
      <h1 class="">
        <mark>마이페이지</mark>
      </h1>
    </div>
    <div class="info-container margin">
      <div class="user-info">
        <div class="profile-img">
          <img src="@/assets/image/pngwing-color.png" alt="" />
        </div>
        <div class="detail-box">
          <div class="row">
            <label for="userId">아이디 :</label>
            <input type="text" id="userId" :value="userInfo.id" disabled />
          </div>
          <div class="row">
            <label for="userName">이름 :</label>
            <input type="text" id="userName" :value="userInfo.name" disabled />
          </div>
          <div class="row">
            <label for="userEmail">이메일 :</label>
            <input type="text" id="userEmail" :value="userInfo.email" disabled />
          </div>
          <div class="row">
            <label for="userAddress">주소 :</label>
            <input type="text" id="userAddress" :value="userInfo.address" disabled />
          </div>
        </div>
      </div>
    </div>

    <div class="like-list margin">
      <h1>찜 목록</h1>
      <RecommendComponent result-type="like" />
    </div>
    <div class="recent-list margin">
      <h1>최근 본 목록</h1>
      <RecommendComponent result-type="history" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";
.title-box {
  display: flex;
  margin: 3% 0 2% 15%;
  img {
    width: 50px;
    min-height: 50px;
    margin: 1%;
  }
  h1 {
    padding-top: 2%;
  }
}

.info-container {
  width: 70%;
  min-width: 570px;
  border: 1px solid lightgray;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  padding: 3%;
  text-align: center;
  margin-left: 15%;
  .user-info {
    display: flex;
    justify-content: space-around;
    margin-bottom: 3%;
  }
  .profile-img {
    margin-bottom: 5%;
    img {
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
    }
  }
  .detail-box {
    display: flex;
    flex-direction: column;
    width: 50%;
    input {
      border: 1px solid lightgray;
      border-radius: 10px;
      margin-bottom: 5%;
      padding-left: 2%;
      width: 100%;
      height: 100%;
    }

    label {
      min-width: 40px;
    }
  }
}
.center {
  display: flex;
  align-self: center;
}
.btn-box {
  display: flex;
  justify-content: center;
  button {
    margin: 0 2% 0 2%;
  }
}

.row {
  display: flex;
  margin-bottom: 5%;
  label {
    margin-right: 5%;
    width: 20%;
    margin-top: 3%;
  }
}
</style>
