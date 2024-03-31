<script setup>
import { ref, onMounted } from "vue";
import { aptCodeInfo, listCompApt } from "@/api/apt.js";

import VSelect from "@/components/common/VSelect.vue";

const props = defineProps(["aptCode"]);
const aptCode = ref({ aptCode: props.aptCode });
const aptInfo = ref();

const compList = ref([]); // 현재 메인 매물 기준 가져온 모든 아파트 정보 배열
const compAptInfo = ref(); // 현재 비교중인 아파트 정보
const menuList = ref(); // 아파트 선택 메뉴 배열
const areaScore = ref();
const yearScore = ref();
const moneyScore = ref();

const getAptDetail = async () => {
  try {
    const response = await aptCodeInfo(aptCode.value);
    aptInfo.value = response.data[0];
  } catch (error) {
    console.log("에러발생", error);
  }
};

// 현재 메인 매물을 기준으로 근처에 있는 아파트 목록을 불러오는 메소드
const getCompList = async () => {
  try {
    // 데이터 불러오기
    const response = await listCompApt(aptCode.value);
    compList.value = response.data;

    // 데이터에 따른 메뉴 리스트 생성
    let options = [];
    var i = 0;
    options.push({ text: "아파트선택", value: "" });
    compList.value.forEach((apt) => {
      options.push({ text: apt.aptName, value: i++ });
      menuList.value = options;
    });
  } catch (error) {
    console.log("에러발생", error);
  }
};

// 메뉴에서 아파트를 선택할 때 호출되는 메소드
const onChangeApt = async (val) => {
  // 비교할 아파트의 정보를 compList에서 불러와 바꾼다.
  compAptInfo.value = compList.value[val];

  // 이후 점수 계산
  // aptInfo가 메인 매물 vs compAptInfo가 비교 매물
  // 면적 점수
  // 1평당 1점 차이 (aptInfo?.area / 3.306).toFixed(1)
  areaScore.value =
    (aptInfo.value.area / 3.306).toFixed(1) - (compAptInfo.value.area / 3.306).toFixed(1);
  console.log(aptInfo.value.area);
  console.log(compAptInfo.value.area);

  // 면적당 가격 점수
  moneyScore.value =
    (aptInfo.value.dealAmount / aptInfo.value.area -
      compAptInfo.value.dealAmount / compAptInfo.value.area) /
    100;
  console.log(moneyScore.value);

  // 건설년도 점수
  yearScore.value = aptInfo.value.buildYear - compAptInfo.value.buildYear;
};

onMounted(async () => {
  await getAptDetail();
  await getCompList();
  window.scrollTo(0, 0);
});
</script>

<template>
  <div class="compare-container">
    <div class="versus flex top-margin">
      <div class="apt left hover">
        <h2>{{ aptInfo?.aptName }}</h2>
        <img class="shadow" src="@/assets/image/default_apt.jpg" alt="" />
      </div>
      <h1>VS</h1>
      <div class="apt right hover">
        <div class="flex center">
          <h2>비교 매물:</h2>
          <div class="select-box">
            <VSelect class="primary" :selectOption="menuList" @onKeySelect="onChangeApt" />
          </div>
        </div>

        <img class="shadow" src="@/assets/image/default_apt.jpg" alt="" />
      </div>
    </div>
    <div v-if="compAptInfo != null" class="progress flex center">
      <a-space direction="vertical" style="width: 60%">
        <a-popover title="점수 기준">
          <template #content> <p>1m<sup>2</sup>당 1점</p> </template>
          <h3 class="flex versus">면적</h3>
        </a-popover>

        <div class="flex hover">
          <h2 class="right-margin left">{{ (aptInfo.area / 3.306).toFixed(1) }}평</h2>
          <a-progress
            :percent="100"
            :success="{ percent: 50 + areaScore }"
            :size="[300, 18]"
            :show-info="false"
          />
          <h2 class="left-margin right">{{ (compAptInfo.area / 3.306).toFixed(1) }}평</h2>
        </div>
        <br />
        <a-popover title="점수 기준">
          <template #content>
            <p>총 가격 / (1m<sup>2</sup> * 10 )</p>
          </template>
          <h3 class="flex center">면적당 가격</h3>
        </a-popover>

        <div class="flex hover">
          <h2 class="right-margin left">
            {{ (aptInfo.dealAmount / aptInfo.area).toFixed(0) }}만원
          </h2>
          <a-progress
            :percent="100"
            :success="{ percent: 50 - moneyScore }"
            :size="[300, 18]"
            :show-info="false"
          />
          <h2 class="left-margin right">
            {{ (compAptInfo.dealAmount / compAptInfo.area).toFixed(0) }}만원
          </h2>
        </div>
        <br />
        <a-popover title="점수 기준">
          <template #content> <p>1년 차이당 2점</p> </template>
          <h3 class="flex versus">완공년도</h3>
        </a-popover>
        <div class="flex hover">
          <h2 class="right-margin left">{{ aptInfo.buildYear }}년</h2>
          <a-progress
            :percent="100"
            :success="{ percent: 50 + yearScore }"
            :size="[300, 18]"
            :show-info="false"
          />
          <h2 class="left-margin right">{{ compAptInfo.buildYear }}년</h2>
        </div>
      </a-space>
    </div>
  </div>

  <h1 class="versus flex margin">상세 정보</h1>
  <div class="detail-infos flex margin">
    <div class="info">
      <p>아파트 이름:&nbsp;&nbsp;{{ aptInfo?.aptName }}</p>
      <p>주소:&nbsp;&nbsp;{{ aptInfo?.roadName }}</p>
      <p>완공년도:&nbsp;&nbsp;{{ aptInfo?.buildYear }}년</p>

      <p v-if="aptInfo?.floor < 0">층: &nbsp;&nbsp; 지하 {{ aptInfo?.floor }}</p>
      <p v-else>층: &nbsp;&nbsp;{{ aptInfo?.floor }}층</p>
      <p>
        면적: &nbsp;&nbsp; {{ aptInfo?.area }} m <sup>2</sup> &nbsp; &nbsp;({{
          (aptInfo?.area / 3.306).toFixed(1)
        }}
        평 )
      </p>
      <p v-if="aptInfo?.dealAmount > 9999">
        가격: {{ (aptInfo?.dealAmount / 10000).toFixed(1) }}억
      </p>
      <p v-else>가격: {{ aptInfo?.dealAmount }}만원</p>
    </div>
    <div class="info">
      <p>아파트 이름:&nbsp;&nbsp;{{ compAptInfo?.aptName }}</p>
      <p>주소:&nbsp;&nbsp;{{ compAptInfo?.roadName }}</p>
      <p>완공년도:&nbsp;&nbsp;{{ compAptInfo?.buildYear }}년</p>

      <p v-if="compAptInfo?.floor < 0">층: &nbsp;&nbsp; 지하 {{ compAptInfo?.floor }}</p>
      <p v-else>층: &nbsp;&nbsp;{{ compAptInfo?.floor }}층</p>
      <p>
        면적: &nbsp;&nbsp; {{ compAptInfo?.area }} m <sup>2</sup> &nbsp; &nbsp;({{
          (compAptInfo?.area / 3.306).toFixed(1)
        }}
        평 )
      </p>
      <p v-if="compAptInfo?.dealAmount > 9999">
        가격: {{ (compAptInfo?.dealAmount / 10000).toFixed(1) }}억
      </p>
      <p v-else>가격: {{ compAptInfo?.dealAmount }}만원</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";

.select-box {
  margin: 0 0 1% 1%;
}
.versus {
  justify-content: space-around;
  //   margin: 5% 0 5% 0;

  .apt {
    text-align: center;
    img {
      width: 70%;
      border-radius: 10%;
    }
  }

  h1 {
    margin-top: 8%;
    font-size: 50px;
  }

  .left {
    img {
      border: 10px solid $primary-color;
    }
  }
  .right {
    img {
      border: 10px solid rgb(139, 199, 255);
    }
  }
}

.detail-infos {
  justify-content: space-evenly;
  .info {
    min-width: 300px;
    p {
      width: 100%;
      border: 1px solid lightgray;
      padding: 10%;
      &:hover {
        scale: 1.05;
        transition-duration: 0.3s;
      }
    }
  }
}

.progress {
  margin: 5% 0 5% 0;
  h2 {
    min-width: 100px;
    text-align: center;
  }
}

.flex {
  display: flex;
}

.hover {
  &:hover {
    scale: 1.05;
    transition-duration: 0.3s;
  }
}

.shadow {
  &:hover {
    box-shadow: 5px 5px 20px #afafaf;
  }
}
.left-margin {
  margin-left: 1%;
}
.right-margin {
  margin-right: 2%;
}

.left {
  color: $primary-color;
}
.right {
  color: rgb(0, 132, 255);
}
.top-margin {
  margin-top: 5%;
}
.center {
  justify-content: center;
}
</style>
