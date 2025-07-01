"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      account: "",
      password: "",
      confirmPassword: ""
    };
  },
  methods: {
    handleRegister() {
      if (!this.account || !this.password || !this.confirmPassword) {
        common_vendor.index.showToast({
          title: "账号、密码和确认密码不能为空",
          icon: "none"
        });
        return;
      }
      if (this.password !== this.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/user/register",
        method: "POST",
        data: { account: this.account, password: this.password },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          if (res.data.code === 0) {
            common_vendor.index.showToast({
              title: "注册成功",
              icon: "success"
            });
            common_vendor.index.navigateBack();
          } else {
            common_vendor.index.showToast({
              title: res.data.message,
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/register/register.vue:86", "注册请求失败:", err);
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
    f: $data.confirmPassword,
    g: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    h: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bac4a35d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
