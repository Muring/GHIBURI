<script setup>
import { ref, onMounted } from "vue";
import { listSido, listGugun } from "@/api/map";
import { useRouter } from "vue-router";
import { listApt, searchApt } from "@/api/apt";

import VSelect from "@/components/common/VSelect.vue";
import { defineProps } from "vue";

const props = defineProps({
  address: String,
  keyword: String,
});

const router = useRouter();

// const serviceKey = import.meta.env.VITE_OPEN_API_SERVICE_KEY;
const { VITE_OPEN_API_SERVICE_KEY } = import.meta.env;

const sidoList = ref([]);
const gugunList = ref([{ text: "구군선택", value: "" }]);

// 객체이므로 {} 사용
// const selectStation = ref({}); // 해당 객체를 아파트 객체로 변경하면 된다.

/*******************  구군 select 코드 *******************/
const param = ref({
  serviceKey: VITE_OPEN_API_SERVICE_KEY,
  pageNo: 1,
  numOfRows: 20,
  zscode: 0, // 구군 코드
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
  param.value.zscode = val;
  getAptList(param.value.zscode);

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
  getAptList(param.value.zscode);
};

/****************** 아파트 정보 ******************/
const aptList = ref([]);
const searchPlace = async () => {
  // 요청 보내기
  await searchApt(
    { address: props.address, keyword: props.keyword ? props.keyword : "" },
    ({ data }) => {
      aptList.value = data;
    }
  );

  displayPlaces(aptList.value);
};

// 아파트 정보를 불러온다.
const getAptList = (zscode) => {
  // api폴더의 apt에 있는 listApt() 메소드를 호출
  listApt(
    zscode,
    ({ data }) => {
      let options = [];
      data.forEach((apt) => {
        options.push({
          aptCode: apt.aptCode,
          aptName: apt.aptName,
          roadName: apt.roadName,
          lat: apt.lat,
          lng: apt.lng,
          dealAmount: apt.dealAmount,
          area: apt.area,
          floor: apt.floor,
          buildYear: apt.buildYear,
        });
      });
      aptList.value = options;
    },
    (err) => {
      console.log(err);
    }
  );
};

/*******************  MAP 코드 *******************/
var map; // 맵 객체

/******** 키워드 변수 ********/
var markers = []; // 마커 (지도에 찍히는 마커)
const infowindow = ref(); // 지도 왼쪽에 정보 띄워주는 객체
const ps = ref(); // 정보 띄워주는 객체 밑의 페이지네이션

/******** 카테고리 변수 ********/
var contentNode, currCategory;
const placeOverlay = ref();
const catMarkers = ref([]);

/******** 클러스터 변수 ********/
var clusterer;

// 구군이 바뀌는것이 station이 바뀌는 것이다. - 이건 무시해도 됨
// const positions = ref([]);
// const props = defineProps({ stations: Array, selectStation: Object });

const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(37.5012860931305, 127.039604663862), // y 넣고 x 넣어야함
    level: 3,
  };
  map = new kakao.maps.Map(container, options);

  /** 검색 **/
  // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성
  infowindow.value = new kakao.maps.InfoWindow({ zIndex: 1 });
  // 장소 검색 객체를 생성
  ps.value = new kakao.maps.services.Places(map);

  /** 카테고리 **/
  // 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
  placeOverlay.value = new kakao.maps.CustomOverlay({ zIndex: 1 });
  contentNode = document.createElement("div"); // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
  catMarkers.value = []; // 마커를 담을 배열입니다
  currCategory = ""; // 현재 선택된 카테고리를 가지고 있을 변수입니다

  // Register idle event on the map
  kakao.maps.event.addListener(map, "idle", searchPlacesByCat);

  // 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
  // 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
  addEventHandle(contentNode, "mousedown", kakao.maps.event.preventMap);
  addEventHandle(contentNode, "touchstart", kakao.maps.event.preventMap);

  contentNode.className = "placeinfo_wrap";
  placeOverlay.value.setContent(contentNode);
  // Add category click event
  addCategoryClickEvent();

  /******* 클러스터 *******/
  clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    minLevel: 5, // 클러스터 할 최소 지도 레벨
    gridSize: 100,
  });

  searchPlace();
};

const insertPlace = () => {
  // 장소검색 객체를 통해 키워드로 장소검색을 요청
  displayPlaces(aptList.value.slice(0, 2000));
};

// 상세 페이지 버튼 동작
window.goDetailPage = (code) => {
  router.push({
    name: "aptDetail",
    params: { aptCode: code },
  });
};

onMounted(async () => {
  window.scrollTo(0, 0);
  await getSidoList();
  if (window.kakao && window.kakao.maps) {
    initMap();
  } else {
    const script = document.createElement("script");
    // autoload=false는 필수
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
      import.meta.env.VITE_KAKAO_MAP_SERVICE_KEY
    }&libraries=services,clusterer`; // 카카오 맵의 어떤 서비스를 사용할 것인지 설정 -> 기본 서비스와 클러스터 사용
    /* global kakao */
    // 카카오는 global 변수라는 것이므로 해당 주석은 지우면 안된다.
    script.onload = () => kakao.maps.load(() => initMap());
    document.head.appendChild(script);
  }
});

/***************** 키워드 검색 *****************/

// 검색 결과 목록과 마커를 표출하는 함수
const displayPlaces = (places) => {
  var listEl = document.getElementById("placesList");
  var menuEl = document.getElementById("menu_wrap");
  var fragment = document.createDocumentFragment();
  var bounds = new kakao.maps.LatLngBounds();
  // listStr = "";

  // 검색 결과 목록에 추가된 항목들을 제거
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거
  removeMarker();

  /***********각 정보들이 저장되어있는 배열***********/

  // 기존 일반 마커를 담을 배열
  var normalMarkers = [];

  // 마커를 생성하고 지도에 표시
  for (var i = 0; i < places.length; i++) {
    clusterer.clear(); // 새로운 검색시 클러스터러 초기화
    var placePosition = new kakao.maps.LatLng(places[i].lat, places[i].lng),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시
    // mouseout 했을 때는 인포윈도우를 닫는다.
    (function (marker, title) {
      kakao.maps.event.addListener(marker, "mouseover", function () {
        displayInfowindow(marker, title);
      });

      kakao.maps.event.addListener(marker, "mouseout", function () {
        infowindow.value.close();
      });

      itemEl.onmouseover = function () {
        displayInfowindow(marker, title);
      };

      itemEl.onmouseout = function () {
        infowindow.value.close();
      };
    })(marker, places[i].aptName);

    // 일반 마커를 배열에 추가
    normalMarkers.push(marker);

    fragment.appendChild(itemEl);
  }

  // 클러스터 생성
  for (var j = 0; j < places.length; j++) {
    // 마커 생성 로직

    var clustMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(places[j].lat, places[j].lng),
    });

    // 클러스터러에 마커 추가
    clusterer.addMarker(clustMarker);

    // 일반 마커 숨기기
    normalMarkers[j].setMap(null);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정
  map.setBounds(bounds);
};

/******** 여기서 왼쪽 검색 목록의 각 Element class명 확인 가능 ********/
// 검색결과 항목을 Element로 반환하는 함수
// 각 검색 결과의 html 코드를 직접 작성해 뿌려준다.
const getListItem = (index, places) => {
  var el = document.createElement("li"),
    itemStr = '<div class="info">' + "   <h3>" + places.aptName + "</h3>";

  if (places.roadName) {
    itemStr +=
      "    <span>" +
      places.roadName +
      "</span>" +
      '   <span class="gray">' +
      places.area +
      "m<sup>" +
      2 +
      "</sup>" +
      "&nbsp;&nbsp;" +
      "( " +
      (places.area / 3.306).toFixed(1) +
      "평 )" +
      "<br>";
  } else {
    itemStr += "    <span>" + places.dealAmount + "</span>";
  }
  if (places.dealAmount > 9999) {
    itemStr += (places.dealAmount / 10000).toFixed(1) + "억" + "</span>" + "</div>";
  } else {
    itemStr += "  <span>" + places.dealAmount + "만원" + "</span>" + "</div>";
  }
  itemStr +=
    "<button onclick='goDetailPage(" + JSON.stringify(places.aptCode) + ")'>상세보기</button>";

  el.innerHTML = itemStr;
  el.className = "item";

  return el;
};

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
const addMarker = (position) => {
  var marker = new kakao.maps.Marker({
    position: position, // 마커의 위치
  });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.value.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
};

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
const removeMarker = () => {
  for (var i = 0; i < markers.length - 1; i++) {
    markers.value[i].setMap(null);
  }
  markers.value = [];
};

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
const displayInfowindow = (marker, title) => {
  var content = '<div style="z-index:1;">' + title + "</div>";

  infowindow.value.setContent(content);
  infowindow.value.open(map, marker);
};

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
const removeAllChildNods = (el) => {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
};

/*************** 카테고리별 검색 ***************/

// Add your functions here, replacing the existing ones
function addEventHandle(target, type, callback) {
  if (target.addEventListener) {
    target.addEventListener(type, callback);
  } else {
    target.attachEvent("on" + type, callback);
  }
}

const searchPlacesByCat = () => {
  if (!currCategory) {
    return;
  }

  placeOverlay.value.setMap(null);
  removeMarkerByCat();

  ps.value.categorySearch(currCategory, placesSearchByCatCB, {
    useMapBounds: true,
  });
};

const placesSearchByCatCB = (data, status) => {
  if (status === kakao.maps.services.Status.OK) {
    displayPlacesByCat(data);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    // Handle zero results
  } else if (status === kakao.maps.services.Status.ERROR) {
    // Handle error
  }
};

/******************** 카테고리 검색 결과 배열 저장 **********************/

const displayPlacesByCat = (places) => {
  console.log(places);
  var order = document.getElementById(currCategory).getAttribute("data-order");

  for (var i = 0; i < places.length; i++) {
    var marker = addMarkerByCat(new kakao.maps.LatLng(places[i].y, places[i].x), order);

    (function (marker, place) {
      kakao.maps.event.addListener(marker, "click", function () {
        displayPlaceInfoByCat(place);
      });
    })(marker, places[i]);
  }
};

const addMarkerByCat = (position, order) => {
  const categoryIcons = [
    "https://ifh.cc/g/aM7bSp.png",
    "https://ifh.cc/g/WhS6cA.png",
    "https://ifh.cc/g/lTQnLw.png",
    "https://ifh.cc/g/OrGxfT.png",
    "https://ifh.cc/g/3TAW7W.png",
    "https://ifh.cc/g/BaTYAa.png",
  ];
  var imageSrc = categoryIcons[order],
    imageSize = new kakao.maps.Size(27, 28),
    imgOptions = {
      spriteSize: new kakao.maps.Size(20, 20),
      spriteOrigin: new kakao.maps.Point(0, 0),
      offset: new kakao.maps.Point(11, 28),
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position,
      image: markerImage,
    });

  marker.setMap(map);
  catMarkers.value.push(marker);

  return marker;
};

const removeMarkerByCat = () => {
  for (var i = 0; i < catMarkers.value.length; i++) {
    catMarkers.value[i].setMap(null);
  }
  catMarkers.value = [];
};

function displayPlaceInfoByCat(place) {
  var content =
    '<div class="placeinfo">' +
    '   <a class="title" href="' +
    place.place_url +
    '" target="_blank" title="' +
    place.place_name +
    '">' +
    place.place_name +
    "</a>";

  if (place.road_address_name) {
    content +=
      '    <span title="' +
      place.road_address_name +
      '">' +
      place.road_address_name +
      "</span>" +
      '  <span class="jibun" title="' +
      place.address_name +
      '">(지번 : ' +
      place.address_name +
      ")</span>";
  } else {
    content += '    <span title="' + place.address_name + '">' + place.address_name + "</span>";
  }

  content +=
    '    <span class="tel">' + place.phone + "</span>" + "</div>" + '<div class="after"></div>';

  contentNode.innerHTML = content;
  placeOverlay.value.setPosition(new kakao.maps.LatLng(place.y, place.x));
  placeOverlay.value.setMap(map);
}

function addCategoryClickEvent() {
  var category = document.getElementById("category"),
    children = category.children;

  for (var i = 0; i < children.length; i++) {
    children[i].onclick = onClickCategory;
  }
}

function onClickCategory() {
  var id = this.id,
    className = this.className;

  placeOverlay.value.setMap(null);

  if (className === "on") {
    currCategory = "";
    changeCategoryClass();
    removeMarkerByCat();
  } else {
    currCategory = id;
    changeCategoryClass(this);
    searchPlacesByCat();
  }
}

function changeCategoryClass(el) {
  var category = document.getElementById("category"),
    children = category.children,
    i;

  for (i = 0; i < children.length; i++) {
    children[i].className = "";
  }

  if (el) {
    el.className = "on";
  }
}
</script>

<template>
  <div id="container">
    <div id="menu_wrap" class="bg_white">
      <div class="map-option-box">
        <div class="map-single-option">
          <VSelect :selectOption="sidoList" @onKeySelect="onChangeSido" />
        </div>
        <div class="map-single-option">
          <VSelect :selectOption="gugunList" @onKeySelect="onChangeGugun" />
        </div>
        <div class="map-single-option">
          <button @click="insertPlace">검색</button>
        </div>
      </div>
      <!-- 키워드로 검색한 목록 -->
      <ul id="placesList"></ul>
    </div>

    <!-- *************************** -->
    <!--    
      MT1 대형마트
      CS2 편의점
      SC4 학교
      SW8 지하철역
      PO3 공공기관
      AT4 관광명소
      HP8 병원
    -->
    <!-- 카테고리 검색 -->
    <ul id="category">
      <li id="MT1" data-order="0">
        <span class="category_bg mart"></span>
        마트
      </li>
      <li id="SC4" data-order="1">
        <span class="category_bg school"></span>
        학교
      </li>
      <li id="SW8" data-order="2">
        <span class="category_bg subway"></span>
        지하철역
      </li>
      <li id="PO3" data-order="3">
        <span class="category_bg publicDep"></span>
        공공기관
      </li>
      <li id="AT4" data-order="4">
        <span class="category_bg tour"></span>
        관광명소
      </li>
      <li id="HP8" data-order="5">
        <span class="category_bg hospital"></span>
        병원
      </li>
    </ul>
    <!-- 지도 및 구군 검색 -->
    <div class="map-container">
      <div id="map"></div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/main.scss";

.map-search-form {
  height: 100%;

  input {
    margin-top: 5%;
    border: 1px solid $primary-color;
    height: 50%;
    width: 70%;
    border-radius: 10px;
  }

  button {
    background-color: white;
    border: 1px solid $primary-color;
    height: 50%;
    border-radius: 10px;
    padding: 2%;
  }
  img {
    width: 5%;
  }
}

#container {
  display: flex;
  width: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.map-option-box {
  display: flex;
  width: 100%;
  padding: 3%;
  min-height: 60px;
  border-bottom: 1px solid lightgray;
  justify-content: center;

  .map-single-option {
    margin-right: 1%;
    button {
      background-color: white;
      border: 1px solid $primary-color;
      height: 100%;
      border-radius: 10px;
      min-width: 50px;
      cursor: pointer;

      &:hover {
        background-color: $primary-color;
        color: white;
        transition-duration: 0.2s;
      }
    }
  }
}

#map {
  width: 100%;
  min-height: 1400px;
  max-height: 1500px;
  z-index: 0;
  overflow: hidden;
}

/************************/

@import "@/assets/scss/keyword.scss";
@import "@/assets/scss/category.scss";
</style>
