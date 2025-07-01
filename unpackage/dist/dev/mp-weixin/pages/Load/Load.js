"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      account: "",
      password: ""
    };
  },
  methods: {
    gotoRegister() {
      common_vendor.index.navigateTo({
        url: `/pages/register/register`
      });
    },
    handleLogin() {
      if (!this.account || !this.password) {
        common_vendor.index.showToast({
          title: "账号和密码不能为空",
          icon: "none"
        });
        return;
      }
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/user/login",
        method: "POST",
        data: { account: this.account, password: this.password },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        withCredentials: true,
        // 允许携带凭证
        success: (res) => {
          const setCookie = res.header["set-cookie"] || res.header["Set-Cookie"];
          if (setCookie) {
            const cookies = Array.isArray(setCookie) ? setCookie.join("; ") : setCookie;
            common_vendor.index.setStorageSync("cookies", cookies);
            common_vendor.index.__f__("log", "at pages/Load/Load.vue:69", "获取Cookie:", cookies);
          }
          if (res.data.code === 0) {
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/index/index"
              });
            }, 500);
          } else {
            common_vendor.index.showToast({
              title: res.data.message,
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Load/Load.vue:89", "登录请求失败:", err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: $data.account,
    c: common_vendor.o(($event) => $data.account = $event.detail.value),
    d: $data.password,
    e: common_vendor.o(($event) => $data.password = $event.detail.value),
    f: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    g: common_vendor.o((...args) => $options.gotoRegister && $options.gotoRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-99396dab"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Load/Load.js.map
