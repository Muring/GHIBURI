<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({ article: Object, menu: Number });
const router = useRouter();
const isAdmin = ref();

onMounted(() => {
  if (props["article"].userId == "ssafy") {
    isAdmin.value = true;
  } else {
    isAdmin.value = false;
  }
});

const id = ref();
id.value = props["article"].id;
const goDetailArticle = () => {
  router.push({
    name: "article-view",
    params: { id: id.value, menu: props.menu },
  });
};
</script>

<template>
  <tr :class="isAdmin ? 'admin-article' : 'user-article'" @click="goDetailArticle">
    <td scope="row">{{ article.id }}</td>
    <td>
      <router-link
        :to="{
          name: 'article-view',
          params: { id: article.id, menu: props.menu },
        }"
      >
        {{ article.title }}
      </router-link>
    </td>
    <td>{{ article.userId }}</td>
    <td>{{ article.hit }}</td>
    <td>{{ article.createDate }}</td>
  </tr>
</template>

<style scoped lang="scss">
@import "@/assets/scss/board.scss";
a {
  text-decoration: none;
}
.admin-article {
  td {
    background-color: $sub-color;
  }
}
</style>
