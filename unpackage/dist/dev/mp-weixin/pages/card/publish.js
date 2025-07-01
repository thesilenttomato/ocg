"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      cardInfo: {
        cardGraph: "",
        cardNumber: "",
        name: "",
        price: "",
        rarity: ""
      }
    };
  },
  methods: {
    // 发布卡牌
    checkLogin() {
      const cookies = common_vendor.index.getStorageSync("cookies");
      if (!cookies) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 1500);
        return false;
      }
      return true;
    },
    publish() {
      if (!this.checkLogin())
        return;
      if (!this.validateForm())
        return;
      common_vendor.index.showLoading({
        title: "发布中..."
      });
      const cookies = common_vendor.index.getStorageSync("cookies");
      const requestData = {
        cardGraph: this.cardInfo.cardGraph,
        cardNumber: parseInt(this.cardInfo.cardNumber),
        name: this.cardInfo.name,
        price: parseFloat(this.cardInfo.price),
        rarity: this.cardInfo.rarity
      };
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/cards/add",
        method: "POST",
        data: requestData,
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": cookies
        },
        success: (res) => {
          if (res.statusCode === 401) {
            common_vendor.index.showToast({
              title: "登录已过期，请重新登录",
              icon: "none"
            });
            common_vendor.index.removeStorageSync("cookies");
            setTimeout(() => {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }, 1500);
            return;
          }
          if (res.data.code === 0) {
            common_vendor.index.showToast({
              title: "发布成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: res.data.message || "发布失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "网络错误，请重试",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/card/publish.vue:171", "请求失败:", err);
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    },
    // 表单验证
    validateForm() {
      if (!this.cardInfo.cardGraph) {
        common_vendor.index.showToast({
          title: "请输入卡牌图片URL",
          icon: "none"
        });
        return false;
      }
      if (!this.cardInfo.name) {
        common_vendor.index.showToast({
          title: "请输入卡牌名称",
          icon: "none"
        });
        return false;
      }
      if (!this.cardInfo.cardNumber) {
        common_vendor.index.showToast({
          title: "请输入卡牌编号",
          icon: "none"
        });
        return false;
      }
      if (!this.cardInfo.price) {
        common_vendor.index.showToast({
          title: "请输入价格",
          icon: "none"
        });
        return false;
      }
      if (!this.cardInfo.rarity) {
        common_vendor.index.showToast({
          title: "请输入稀有度",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    // 取消
    cancel() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.cancel && $options.cancel(...args)),
    b: $data.cardInfo.cardGraph,
    c: common_vendor.o(($event) => $data.cardInfo.cardGraph = $event.detail.value),
    d: $data.cardInfo.name,
    e: common_vendor.o(($event) => $data.cardInfo.name = $event.detail.value),
    f: $data.cardInfo.cardNumber,
    g: common_vendor.o(($event) => $data.cardInfo.cardNumber = $event.detail.value),
    h: $data.cardInfo.price,
    i: common_vendor.o(($event) => $data.cardInfo.price = $event.detail.value),
    j: $data.cardInfo.rarity,
    k: common_vendor.o(($event) => $data.cardInfo.rarity = $event.detail.value),
    l: common_vendor.o((...args) => $options.publish && $options.publish(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e16ddaf2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/card/publish.js.map
