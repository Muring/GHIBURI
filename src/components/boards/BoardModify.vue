<script setup>
import { useRoute } from "vue-router";
import BoardFormItem from "./item/BoardFormItem.vue";

const route = useRoute();
const { id, menu } = route.params;
</script>

<template>
  <div class="container">
    <div class="">
      <div class="title-box">
        <img src="@/assets/image/pngwing-color.png" alt="" />
        <h1 class="">
          <mark>글수정</mark>
        </h1>
      </div>
      <div>
        <BoardFormItem type="modify" :menu="menu" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";

.container {
  margin-top: 5%;
  .title-box {
    display: flex;
    img {
      width: 50px;
      min-height: 50px;
      margin: 1%;
    }
    h1 {
      padding-top: 2%;
    }
  }
}
</style>
