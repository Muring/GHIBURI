<script setup>
import { ref, onMounted } from "vue";
import { userAddressApt, userHistory, userLike } from "@/api/apt.js";
import Flicking from "@egjs/vue3-flicking";
import { Pagination, AutoPlay, Fade } from "@egjs/flicking-plugins";
import "@egjs/flicking-plugins/dist/pagination.css";
import VApartCard from "../common/VApartCard.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user-store";

const props = defineProps({ resultType: String });
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const plugins = [
  new Pagination({ type: "bullet" }),
  new AutoPlay({
    duration: 0,
    direction: "NEXT",
    stopOnHover: true,
    animationDuration: 8000,
  }),
  new Fade(),
];

const getDongAptList = () => {
  const address = {
    address: (userInfo && userInfo.value && userInfo.value.address) || "서울특별시 강남구",
  };
  userAddressApt(
    address,
    ({ data }) => {
      aptList.value = data;
    },
    ({ error }) => {
      console.log(error);
    }
  );
};

const getHistList = () => {
  userHistory(
    userInfo,
    ({ data }) => {
      aptList.value = data;
    },
    ({ error }) => {
      console.log(error);
    }
  );
};

const getLikeList = () => {
  userLike(
    userInfo,
    ({ data }) => {
      aptList.value = data;
    },
    ({ error }) => {
      console.log(error);
    }
  );
};

onMounted(() => {
  if (props.resultType == "base") {
    getDongAptList();
  } else if (props.resultType == "history") {
    getHistList();
  } else if (props.resultType == "like") {
    getLikeList();
  }
});

const aptList = ref([]);
</script>

<template>
  <Flicking
    class="flicker-box"
    :options="{
      circular: true,
      panelsPerView: 3,
    }"
    :plugins="plugins"
  >
    <div v-for="apt in aptList" :key="apt.aptCode">
      <div class="card-panel">
        <VApartCard :apt="apt" />
      </div>
    </div>
    <template #viewport>
      <div class="margin-box"></div>
      <div class="flicking-pagination"></div>
    </template>
  </Flicking>
</template>

<style scoped lang="scss">
@import url("@egjs/vue3-flicking/dist/flicking.css");
@import "@/assets/scss/main.scss";
.flicker-box {
  margin: 5% 0 0 0;
  text-align: center;
}

.margin-box {
  min-height: 50px;
}
.card-panel {
  display: flex;
  justify-content: center;
}

/* flicking button color change required*/
</style>
