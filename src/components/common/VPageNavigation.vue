<script setup>
import { computed } from "vue";

const props = defineProps({ currentPage: Number, totalPage: Number });
const emit = defineEmits(["pageChange"]);

const navigationSize = parseInt(import.meta.env.VITE_ARTICLE_NAVIGATION_SIZE);

const startPage = computed(() => {
  return parseInt((props.currentPage - 1) / navigationSize) * navigationSize + 1;
});

const endPage = computed(() => {
  let lastPage =
    parseInt((props.currentPage - 1) / navigationSize) * navigationSize + navigationSize;
  return props.totalPage < lastPage ? props.totalPage : lastPage;
});

const endRange = computed(() => {
  return parseInt((props.totalPage - 1) / navigationSize) * navigationSize < props.currentPage;
});

function range(start, end) {
  const list = [];
  for (let i = start; i <= end; i++) list.push(i);
  return list;
  //   return Array(end - start + 1)
  //     .fill()
  //     .map((val, i) => start + i);
}

function onPageChange(pg) {
  console.log(pg + "로 이동!!!");
  emit("pageChange", pg);
}
</script>

<template>
  <div class="pagination-box">
    <ul class="pagination">
      <a class="page-link" @click="onPageChange(1)"> <li class="page-item">&lt;&lt;</li></a>
      <a class="page-link" @click="onPageChange(startPage == 1 ? 1 : startPage - 1)">
        <li class="page-item">&lt;</li>
      </a>
      <template v-for="pg in range(startPage, endPage)" :key="pg">
        <a
          :class="currentPage === pg ? 'page-link active' : 'page-link'"
          class=""
          @click="onPageChange(pg)"
        >
          <li>
            {{ pg }}
          </li>
        </a>
      </template>
      <a class="page-link" @click="onPageChange(endRange ? totalPage : endPage + 1)">
        <li class="page-item">&gt;</li></a
      >
      <a class="page-link" @click="onPageChange(totalPage)"> <li class="page-item">&gt;&gt;</li></a>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";

* {
  list-style: none;
}

a {
  cursor: pointer;
  color: black;
  &:hover {
    color: $primary-color;
  }
}

.pagination-box {
  display: flex;
  justify-content: center;
  .pagination {
    display: flex;
    justify-content: space-around;
    width: 60%;
    margin-top: 2%;
  }
}

.page-link {
  border: 0.13rem solid $primary-color;
  border-radius: 50px;
  padding: 1% 2% 1% 2%;
  text-align: center;
  &.active {
    background-color: $primary-color;
    color: white;
  }
  &:active {
    background-color: $primary-color;
    color: white;
  }
}
</style>
