<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

defineProps({ apt: Object });

/* 여기서 해당 카드의 아파트 정보를 detail로 보내야함 */
function goDetail(code) {
  console.log(code);
  router
    .push({
      name: "aptDetail",
      params: { aptCode: code },
    })
    .then(() => {
      window.location.reload();
    });
}

// 면적, 층수, 아파트이름, 완공년도, 가격,
</script>

<template>
  <div class="card spring-fever">
    <div class="card-info">
      <div class="text-container">
        <h2>{{ apt.aptName }}</h2>
        <p v-if="apt.floor < 0">
          {{ apt.area }}m<sup>2</sup>&nbsp;&nbsp;{{
            (apt.area / 3.306).toFixed(1)
          }}평&nbsp;&nbsp;지하{{ apt.floor * -1 }}층
        </p>
        <p v-else>
          {{ apt.area }}m<sup>2</sup>&nbsp;&nbsp;{{ (apt.area / 3.306).toFixed(1) }}평&nbsp;&nbsp;{{
            apt.floor
          }}층
        </p>

        <p v-if="apt.dealAmount > 1000">{{ (apt.dealAmount / 10000).toFixed(1) }}억</p>
        <p v-else>{{ apt.dealAmount }}만원</p>
      </div>
      <div class="box-container">
        <button type="button" class="success" @click="goDetail(apt.aptCode)">상세보기</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";

// variables
$card-width: 200px;
$card-height: 250px;

.card {
  margin: 10% 0 2% 0;
  min-width: $card-width;
  min-height: $card-height;
  width: 80%;
  top: 50%;
  left: 50%;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.5);
  text-align: center;
  &.spring-fever {
    background: url(@/assets/image/default_apt.jpg) no-repeat center center;
    background-size: cover;
  }

  &:hover {
    transform: scale(1.1);
    transition: 0.8s;

    .card-info {
      opacity: 1;
      bottom: 5%;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}

.blank-container {
  height: 60%;
  z-index: 20;
}
.card-info {
  width: 100%;
  height: 100%;
  font-style: 16px;
  padding-top: 65%;
  opacity: 0;
  transition:
    bottom 0.3s,
    opacity 0.3s cubic-bezier(0.33, 0.66, 0.66, 1);
}

.text-container {
  color: white;
}
.box-container {
  display: flex;
  justify-content: center;
  margin: 5% 0 10% 0;

  button {
    min-height: 40px;
  }
}
</style>
