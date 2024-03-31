<script setup>
import { ref, onMounted } from "vue";
const props = defineProps({ article: Object });

const isAdmin = ref();
onMounted(() => {
  if (props["article"].userId == "admin") {
    isAdmin.value = true;
  } else {
    isAdmin.value = false;
  }
});
</script>

<template>
  <tr>
    <td>
      <a :href="article.link" target="_blank">{{ article.title }}</a>
    </td>
  </tr>
</template>

<style scoped lang="scss">
@import "@/assets/scss/board.scss";
a {
  color: black;
  text-decoration: none;
}
td {
  text-align: left;
  padding-left: 7%;
  padding-right: 7%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
