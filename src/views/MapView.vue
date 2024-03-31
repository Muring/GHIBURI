<script setup>
import VKakaoMap from "@/components/map/VKakaoMap.vue";
import { defineProps } from "vue";

defineProps({
  address: String,
  keyword: String,
});
</script>

<template>
  <div class="view-container">
    <VKakaoMap :address="address" :keyword="keyword" />
  </div>
</template>

<style>
.view-container {
  width: 100%;
}
</style>
