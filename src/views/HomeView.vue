<script setup>
import { ref, onMounted, watch } from "vue";
import { listSido, listGugun } from "@/api/map";
import { mainNews } from "@/api/news";
import { recentList } from "@/api/board";
import { useRouter } from "vue-router";

import VSelect from "@/components/common/VSelect.vue";
import RecommendComponent from "@/components/recommendation/RecommendComponent.vue";
import NewsListItem from "@/components/news/item/NewsListItem.vue";
import BoardListItem from "@/components/boards/item/BoardListItem.vue";

const router = useRouter();
const sidoList = ref([{ text: "시도선택", value: "" }]);
const gugunList = ref([{ text: "구군선택", value: "" }]);

// const serviceKey = import.meta.env.VITE_OPEN_API_SERVICE_KEY;
const { VITE_OPEN_API_SERVICE_KEY } = import.meta.env;

const param = ref({
  serviceKey: VITE_OPEN_API_SERVICE_KEY,
  pageNo: 1,
  numOfRows: 20,
  zscode: 0, // 구군 코드
});

// 해당 페이지가 실행되었을 때, 즉시 실행
onMounted(() => {
  getSidoList();
  getNewsList();
  getRecentList();
});

const address = ref(""); // dongcode혹은 sidoocde를 가지는 반응형 변수
const selectedCity = ref(""); // '시, 도' 선택을 위한 반응형 변수
const selectedDistrict = ref(""); // '구, 군' 선택을 위한 반응형 변수

const keyword = ref(""); // 검색어를 가지는 반응형 변수

watch([selectedCity, selectedDistrict], () => {
  if (selectedDistrict.value == "") {
    address.value = `${selectedCity.value}`;
  } else {
    if (selectedCity.value === selectedDistrict.value.substring(0, 2)) {
      address.value = `${selectedDistrict.value}`;
    } else {
      address.value = `${selectedCity.value}`;
    }
  }
});
// 시도 배열을 가져온다.
const getSidoList = () => {
  // api폴더의 map에 있는 listSido() 메소드를 호출
  listSido(
    ({ data }) => {
      let options = [];
      options.push({ text: "시도선택", value: "" });
      data.forEach((sido) => {
        options.push({ text: sido.sidoName, value: sido.sidoCode });
      });
      sidoList.value = options;
    },
    (err) => {
      console.log(err);
    }
  );
};

const onChangeSido = (val) => {
  listGugun(
    { sido: val },
    ({ data }) => {
      let options = [];
      options.push({ text: "구군선택", value: "" });
      data.forEach((gugun) => {
        options.push({ text: gugun.gugunName, value: gugun.gugunCode });
      });
      gugunList.value = options;
    },
    (err) => {
      console.log(err);
    }
  );
};

const onChangeGugun = (val) => {
  param.value.zscode = val;
  // getChargingStations();
};

// 메인 뉴스 게시판
const newsList = ref([]);

const getNewsList = () => {
  mainNews(
    ({ data }) => {
      newsList.value = data;
    },
    (error) => {
      console.log(error);
    }
  );
};
// 메인 커뮤니티 게시판
const commList = ref([]);
const getRecentList = () => {
  recentList(
    ({ data }) => {
      commList.value = data;
    },
    (error) => {
      console.log(error);
    }
  );
};

const mapSearch = () => {
  router.push({
    name: "map",
    query: { address: address.value, keyword: keyword.value ? keyword.value : "" },
  });
};
</script>

<template>
  <div class="main-search">
    <h1 class="main-word">Welcome to GHIBURI</h1>
    <h1>검색</h1>
    <form action="" class="search-form" @submit.prevent="mapSearch()">
      <div class="option-box">
        <div class="single-option">
          <VSelect :selectOption="sidoList" @onKeySelect="onChangeSido" v-model="selectedCity" />
        </div>
        <div class="single-option">
          <VSelect
            :selectOption="gugunList"
            @onKeySelect="onChangeGugun"
            v-model="selectedDistrict"
          />
        </div>
      </div>
      <input type="text" class="input-box" v-model="keyword" />
      <button class="search-btn">Search</button>
    </form>
  </div>
  <div class="recommend-box">
    <h1>추천 매물</h1>
    <RecommendComponent resultType="base" />
  </div>
  <div class="board-box">
    <div class="board">
      <div class="flex more">
        <h2>커뮤니티</h2>
        <RouterLink :to="{ name: 'community-list' }">[더보기]</RouterLink>
      </div>
      <table class="main-board">
        <thead>
          <tr>
            <th scope="col">글번호</th>
            <th scope="col">제목</th>
            <th scope="col">작성자</th>
            <th scope="col">조회수</th>
            <th scope="col">작성일</th>
          </tr>
        </thead>
        <tbody>
          <BoardListItem
            v-for="comm in commList"
            :key="comm.id"
            :article="comm"
            :menu="1"
          ></BoardListItem>
        </tbody>
      </table>
    </div>
    <div class="board">
      <div class="flex more">
        <h2>뉴스</h2>
        <RouterLink :to="{ name: 'news-list' }">[더보기]</RouterLink>
      </div>
      <table class="main-board">
        <thead>
          <tr>
            <th>제목</th>
          </tr>
        </thead>
        <tbody>
          <NewsListItem v-for="news in newsList" :key="news.id" :article="news"></NewsListItem>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style>
@import url("@egjs/vue3-flicking/dist/flicking.css");
</style>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";
@import "@/assets/scss/board.scss";

/* main문 상단 부분 */
.main-word {
  font-weight: 800;
  font-size: 60px;
}
.main-search {
  background-color: $primary-color;
  background-image: linear-gradient(to top left, $primary-color 40%, $gradation-color);
  padding: 10%;
  h1 {
    color: white;
  }
  .option-box {
    display: flex;
    .select-box {
      border: white;
      margin-right: 10px;
    }
  }
  .search-form {
    display: inline-flex;
    height: 50px;
    width: 100%;
  }
  .search-btn {
    background-color: $primary-color;
    color: white;
    border: 1px solid white;
    width: 15%;
    padding: 1%;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .search-btn:hover {
    background-color: white;
    color: $primary-color;
    border-left-color: $primary-color;
    transition-duration: 0.5s;
  }
  .input-box {
    width: 100%;
    border: 1px solid white;
    padding: 1%;
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
  }
  input:focus {
    outline: none;
  } /* outline 테두리 없애기 */
}

/* 추천 부분 */
.recommend-box {
  margin: 5% 10% 5% 10%;
  min-width: 700px;
  h1 {
    margin: 0;
  }
}

/* 보드부분 */
.board-box {
  margin: 5%;
  display: flex;
  justify-content: space-evenly;
  .board {
    width: 40%;
    height: 100%;
  }
  .main-board {
    width: 100%;
    overflow: hidden;
  }
}

.more {
  justify-content: space-between;
  a {
    text-decoration: none;
    color: $primary-color;
    padding-top: 2%;

    &:focus {
      display: none;
    }
  }
}
</style>
