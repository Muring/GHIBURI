<script setup>
import BoardFormItem from "./item/BoardFormItem.vue";
</script>

<template>
  <div class="container">
    <div>
      <div class="title-box">
        <img src="@/assets/image/pngwing-color.png" alt="" />
        <h1 class="">
          <mark>글쓰기</mark>
        </h1>
      </div>
      <div class="col-lg-10 text-start">
        <BoardFormItem type="regist" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
