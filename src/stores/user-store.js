import { ref } from "vue";
import { defineStore } from "pinia";
import { userLogin, userSignup, userLogout, userWithdraw, userIdCheck, local } from "@/api/user";

export const useUserStore = defineStore(
  "userStore",
  () => {
    //*** state ***/
    const userInfo = ref(null);
    const isLogin = ref(false);
    const isDuplicated = ref(false);

    const login = async (loginInfo) => {
      await userLogin(loginInfo, (response) => {
        local.defaults.headers.common["Authorization"] = response.data["accessToken"];
        userInfo.value = response.data["userInfo"];
        isLogin.value = true;
      });
    };

    const logout = async () => {
      await userLogout(() => {
        local.defaults.headers.common["Authorization"] = "";
        userInfo.value = null;
        isLogin.value = false;
      });
    };

    const withdraw = async () => {
      await userWithdraw(() => {
        local.defaults.headers.common["Authorization"] = "";
        userInfo.value = null;
        isLogin.value = false;
      });
    };

    const signup = async (signupInfo) => {
      await userSignup(
        signupInfo,
        (response) => {
          alert(response.data.message);
        },
        () => {
          alert("아이디 중복입니다.");
          window.location.reload();
        }
      );
    };

    const idCheck = async (userId) => {
      await userIdCheck(
        userId,
        (response) => {
          isDuplicated.value = response.data;
        },
        (error) => {
          console.log(error);
        }
      );
    };

    return {
      login,
      logout,
      withdraw,
      signup,
      idCheck,
      userInfo,
      isLogin,
      isDuplicated,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
