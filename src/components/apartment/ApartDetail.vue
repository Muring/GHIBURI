<script setup>
import { ref, onMounted } from "vue";
import { aptCodeInfo, addLike, removeLike } from "@/api/apt.js";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user-store";
import RecommendComponent from "../recommendation/RecommendComponent.vue";
import router from "../../router";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const isLike = ref();

const likeStatus = () => {
  isLike.value = !isLike.value;
  // 칠해진경우
  if (isLike.value) {
    addLike({
      userId: userInfo.value?.id,
      aptCode: aptInfo.value?.aptCode,
    });
  } else {
    // 끈 경우
    removeLike({
      userId: userInfo.value?.id,
      aptCode: aptInfo.value?.aptCode,
    });
  }
};

const props = defineProps(["aptCode"]);
const aptCode = ref({ aptCode: props.aptCode });
const aptInfo = ref();

const getAptDetail = async () => {
  try {
    const userId = { userId: userInfo.value?.id };
    const response = await aptCodeInfo(aptCode.value, userId);
    aptInfo.value = response.data[0];
    isLike.value = aptInfo.value.likeState;
  } catch (error) {
    console.log("에러발생", error);
  }
};

const initRoadView = () => {
  let roadviewContainer = document.getElementById("roadview"); //로드뷰를 표시할 div
  let roadview = new kakao.maps.Roadview(roadviewContainer); //로드뷰 객체
  let roadviewClient = new kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체
  let position = new kakao.maps.LatLng(aptInfo.value?.lat, aptInfo.value?.lng);

  roadviewClient.getNearestPanoId(position, 100, function (panoId) {
    // let viewpoint = new kakao.maps.Viewpoint(10, 100, 0, panoId);
    // roadview.setViewpoint(viewpoint);
    roadview.setPanoId(panoId, position); //panoId와 중심좌표를 통해 로드뷰 실행
    let viewpoint = new kakao.maps.Viewpoint();
    viewpoint.pan = 30; // 카메라의 수평 방향 조절
    viewpoint.tilt = 100; // 카메라의 수직 방향 조절
    viewpoint.zoom = 0; // 확대 수준 조절
    roadview.setViewpoint(viewpoint);
  });
  kakao.maps.event.addListener(roadview, "init", function () {
    // 로드뷰에 올릴 마커를 생성합니다.
    var rMarker = new kakao.maps.Marker({
      position: position,
      map: roadview, //map 대신 rv(로드뷰 객체)로 설정하면 로드뷰에 올라갑니다.
    });

    rMarker.setAltitude(20); //마커의 높이를 설정합니다. (단위는 m입니다.)
    // 로드뷰에 올릴 장소명 인포윈도우를 생성합니다.
    // var rLabel = new kakao.maps.InfoWindow({
    //   position: position,
    //   content: aptInfo.value.aptName,
    // });
    // rLabel.open(roadview, rMarker);

    // 로드뷰 마커가 중앙에 오도록 로드뷰의 viewpoint 조정 합니다.
    var projection = roadview.getProjection(); // viewpoint(화면좌표)값을 추출할 수 있는 projection 객체를 가져옵니다.

    // 마커의 position과 altitude값을 통해 viewpoint값(화면좌표)를 추출합니다.
    var viewpoint = projection.viewpointFromCoords(rMarker.getPosition(), rMarker.getAltitude());
    roadview.setViewpoint(viewpoint); //로드뷰에 뷰포인트를 설정합니다.
  });
};

// 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.

onMounted(async () => {
  await getAptDetail();
  window.scrollTo(0, 0);
  if (window.kakao && window.kakao.maps) {
    initRoadView();
  } else {
    const script = document.createElement("script");
    // autoload=false는 필수
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
      import.meta.env.VITE_KAKAO_MAP_SERVICE_KEY
    }&libraries=services,clusterer`; // 카카오 맵의 어떤 서비스를 사용할 것인지 설정 -> 기본 서비스와 클러스터 사용
    /* global kakao */
    // 카카오는 global 변수라는 것이므로 해당 주석은 지우면 안된다.
    script.onload = () => kakao.maps.load(() => initRoadView());
    document.head.appendChild(script);
  }
});

const goCompare = () => {
  router.push({
    name: "aptCompare",
    params: { aptCode: props.aptCode },
  });
};
</script>

<template>
  <div class="detail-container">
    <!-- 카카오 로드맵 출력해 보기  -->
    <div id="roadview" />
    <div class="info-container">
      <div class="info-top">
        <h2>아파트 상세 정보</h2>
        <label for="checkbox" v-if="userInfo != undefined">
          <input type="checkbox" id="checkbox" hidden @click="likeStatus" v-model="isLike" />
          <svg
            t="1689815540548"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2271"
          >
            <path
              d="M742.4 101.12A249.6 249.6 0 0 0 512 256a249.6 249.6 0 0 0-230.72-154.88C143.68 101.12 32 238.4 32 376.32c0 301.44 416 546.56 480 546.56s480-245.12 480-546.56c0-137.92-111.68-275.2-249.6-275.2z"
              fill="#231F20"
              p-id="2272"
              id="heart"
            ></path>
          </svg>
        </label>
      </div>
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
    <div class="center">
      <button class="success larger" @click="goCompare">다른 매물과 비교하러 가기</button>
    </div>
    <div class="recommend-box">
      <h1>추천 매물</h1>
      <RecommendComponent result-type="base" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/scss/main.scss";
@import "@/assets/scss/like.scss";
.detail-container {
  width: 80%;
  margin-left: 12%;

  img {
    width: 100%;
    min-height: 400px;
    min-width: 400px;
  }

  p {
    margin: 0;
    border-bottom: 1px solid lightgray;
    padding: 3% 0;
  }

  .info-container {
    width: 100%;
    min-height: 300px;
    margin-top: 5%;

    .info-top {
      display: flex;
      justify-content: space-between;
    }
  }

  #roadview {
    width: 80%;
    height: 700px;
    margin-top: 2%;
    margin-left: 8%;
  }
  .recommend-box {
    margin: 5% 0;
  }
}

.center {
  display: flex;
  justify-content: center;
  margin-top: 3%;

  .larger {
    width: 30%;
    min-height: 100px;
    font-size: x-large;
  }
}
</style>
