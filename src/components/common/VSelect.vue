<script setup>
import { ref } from "vue";
defineProps({ selectOption: Array });
const emit = defineEmits(["onKeySelect"]);

const key = ref("");

const onSelect = () => {
  // console.log(key.value + "선택!!!");
  emit("onKeySelect", key.value);
};
</script>

<template>
  <select v-model="key" class="select-box" @change="onSelect">
    <option
      v-for="option in selectOption"
      :key="option.value"
      :value="option.value"
      :disabled="option.value === '' ? true : false"
      class="option"
    >
      {{ option.text }}
    </option>
  </select>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";

/********************** */
.select-box {
  height: 100%;
  border-radius: 10px;
  border-color: $primary-color;

  &:focus {
    outline: 1px solid $primary-color;
  }
  &:active {
    border: 1px solid $primary-color;
  }
  .option {
    border-radius: 10px;
    transition: all 0.6s ease-in-out;
  }
}
</style>
