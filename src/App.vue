<script setup>
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import TheHeadingNavbar from "@/components/layout/TheHeadingNavbar.vue";
import TheFooter from "@/components/layout/TheFooter.vue";

const route = useRoute();

const hideHeader = computed(() => {
  // 메타 필드가 없거나, hideHeader 명시적으로 true가 아닌 경우에는 false를 반환
  return route.meta.hideHeader === true;
});
const hideFooter = computed(() => {
  // 메타 필드가 없거나, hideFooter 명시적으로 true가 아닌 경우에는 false를 반환
  return route.meta.hideFooter === true;
});
</script>

<template>
  <header v-if="!hideHeader">
    <TheHeadingNavbar />
  </header>
  <div :class="{ background: hideHeader, hideFooter }">
    <main>
      <RouterView />
    </main>
  </div>
  <footer v-if="!hideFooter">
    <TheFooter />
  </footer>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap");
* {
  margin: 0;
  padding: 0;
  font-family: "Noto Sans KR", sans-serif;
}
#app {
  width: 100%;
  height: 100%;
}
.background {
  @import "@/assets/scss/main.scss";
  width: 100%;
  height: 100%;

  background-color: $primary-color;
  background: linear-gradient(to right, $gradation-color, $primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
