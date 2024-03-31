import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/user",
      name: "user",
      component: () => import("@/views/TheUserView.vue"),
      children: [
        {
          path: "sign",
          name: "login",
          meta: { hideHeader: true, hideFooter: true },
          component: () => import("@/components/users/UserLogin.vue"),
        },
        {
          path: "sign",
          name: "signup",
          meta: { hideHeader: true, hideFooter: true },
          component: () => import("@/components/users/UserLogin.vue"),
        },
        {
          path: "mypage",
          name: "mypage",
          component: () => import("@/components/users/UserMyPage.vue"),
        },
        // {
        //   path: "modify/:userid",
        //   name: "user-modify",
        //   component: () => import("@/components/users/UserModify.vue"),
        // },
      ],
    },
    {
      path: "/board",
      name: "board",
      component: () => import("@/views/BoardView.vue"),
      children: [
        {
          path: "notice",
          name: "notice-list",
          component: () => import("@/components/boards/NoticeList.vue"),
        },
        {
          path: "view/:id/:menu",
          name: "article-view",
          component: () => import("@/components/boards/BoardDetail.vue"),
        },
        {
          path: "write",
          name: "article-write",
          component: () => import("@/components/boards/BoardWrite.vue"),
        },
        {
          path: "modify/:id",
          name: "article-modify",
          component: () => import("@/components/boards/BoardModify.vue"),
        },
        {
          path: "community",
          name: "community-list",
          component: () => import("@/components/boards/CommunityList.vue"),
        },
      ],
    },
    {
      path: "/news",
      name: "news",
      component: () => import("@/views/NewsView.vue"),
      children: [
        {
          path: "list",
          name: "news-list",
          component: () => import("@/components/news/newsList.vue"),
        },
      ],
    },
    {
      path: "/map",
      name: "map",
      meta: { hideFooter: true },
      props: (route) => ({
        address: route.query.address ? route.query.address : "11680",
        keyword: route.query.keyword ? route.query.keyword : "",
      }),
      component: () => import("@/views/MapView.vue"),
    },
    {
      path: "/aptDetail/:aptCode",
      name: "aptDetail",
      props: (route) => ({
        aptCode: route.params.aptCode,
      }),
      component: () => import("@/components/apartment/ApartDetail.vue"),
    },
    {
      path: "/aptDetail/compare/:aptCode",
      name: "aptCompare",
      props: (route) => ({
        aptCode: route.params.aptCode,
      }),
      component: () => import("@/components/apartment/ApartCompare.vue"),
    },
  ],
});

export default router;
