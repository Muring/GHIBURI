<script setup>
import { useUserStore } from "@/stores/user-store";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { isLogin } = storeToRefs(userStore);

const logout = async () => {
  await userStore.logout();
};
</script>

<template>
  <nav>
    <div class="main">
      <img src="@/assets/image/pngwing-color.png" alt="" />
      <RouterLink :to="{ name: 'home' }">GHIBURI</RouterLink>
    </div>
    <a-row class="menu">
      <a-col :sapn="8" class="fixed-menu">
        <RouterLink :to="{ name: 'notice-list' }">공지사항</RouterLink>
        <RouterLink :to="{ name: 'community-list' }">커뮤니티</RouterLink>
        <RouterLink :to="{ name: 'map' }">지도</RouterLink>
        <RouterLink :to="{ name: 'news-list' }">뉴스</RouterLink>
      </a-col>
      <a-col :span="5" v-if="!isLogin" class="change-menu">
        <RouterLink :to="{ name: 'login' }">로그인</RouterLink>
        <RouterLink :to="{ name: 'signup' }">회원가입</RouterLink>
      </a-col>
      <a-col span="6" v-else class="change-menu">
        <RouterLink :to="{ name: 'mypage' }">마이페이지</RouterLink>
        <RouterLink @click.stop="logout" :to="{ name: 'login' }">로그아웃</RouterLink>
      </a-col>
    </a-row>
  </nav>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";

nav {
  display: flex;
  border-bottom: 1px solid rgb(233, 231, 231);
  padding: 2% 0 1% 0;
  justify-content: space-around;
}
a {
  text-decoration: none;
  color: black;
}
a:hover {
  color: $primary-color;
}
img {
  max-height: 40px;
  margin-right: 1%;
}
.main {
  margin-left: 5%;
  display: flex;
  font-size: xx-large;
  font-weight: bold;
  a {
    color: $primary-color;
    background-image: linear-gradient(to top left, $primary-color 40%, $gradation-color);
    color: transparent;
    -webkit-background-clip: text;
  }
}
.menu {
  width: 100%;
  margin-top: 0.5%;
  font-weight: 500;
  justify-content: space-between;
  .fixed-menu {
    width: 50%;
    a {
      margin-left: 10%;
      font-size: clamp(12px, 1.5vw, 18px);
      font-weight: 700;
    }
  }
  .change-menu {
    a {
      margin-right: 10%;
      font-size: clamp(12px, 1.5vw, 18px);
    }
  }
}
</style>
