"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      publishingCount: 0,
      messageCount: 0,
      collectionCount: 0
    };
  },
  onShow() {
    this.getAllCollectCards();
    this.loadUserCards();
    this.loadMessageCount();
  },
  methods: {
    getAllCollectCards() {
      const cookies = common_vendor.index.getStorageSync("cookies");
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/userFavorite/get",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": cookies
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.collectionCount = res.data.data.length;
          } else {
            common_vendor.index.__f__("log", "at pages/personal/personal.vue:122", res.data.code);
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/personal/personal.vue:130", "请求失败:", err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
        }
      });
    },
    async loadUserCards() {
      try {
        const res = await new Promise((resolve, reject) => {
          common_vendor.index.request({
            url: "http://127.0.0.1:8080/cards/get/own",
            method: "GET",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Cookie": common_vendor.index.getStorageSync("cookies")
            },
            success: (res2) => {
              if (res2.statusCode === 200) {
                resolve(res2);
              } else {
                reject(new Error(`请求失败，状态码: ${res2.statusCode}`));
              }
            },
            fail: (err) => {
              reject(err);
            }
          });
        });
        const responseData = res.data || {};
        if (responseData.code === 0) {
          this.publishingCount = Array.isArray(responseData.data) ? responseData.data.filter((card) => card.status === 1).length : 0;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/personal/personal.vue:168", "加载卡牌数据失败:", error);
      }
    },
    //卡牌计数
    async loadMessageCount() {
      try {
        const res = await new Promise((resolve, reject) => {
          common_vendor.index.request({
            url: "http://127.0.0.1:8080/post/get",
            method: "GET",
            header: {
              "Cookie": common_vendor.index.getStorageSync("cookies")
            },
            success: (res2) => {
              if (res2.statusCode === 200) {
                resolve(res2);
              } else {
                reject(new Error(`请求失败，状态码: ${res2.statusCode}`));
              }
            },
            fail: (err) => {
              reject(err);
            }
          });
        });
        const responseData = res.data || {};
        if (responseData.code === 0) {
          this.messageCount = Array.isArray(responseData.data) ? responseData.data.length : 0;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/personal/personal.vue:199", "获取消息数失败:", error);
      }
    },
    navigateTo(page) {
      const routes = {
        "myPublish": "/pages/card/myPublish",
        "publishCard": "/pages/card/publish",
        "myCollection": "/pages/CollectedGoodsCard/CollectedGoodsCard",
        "messageCenter": "/pages/message/myMessage",
        "accountSettings": "/pages/settings/account",
        "securityCenter": "/pages/Report/Report",
        "feedback": "/pages/settings/feedback",
        "aboutUs": "/pages/settings/about"
      };
      common_vendor.index.navigateTo({
        url: routes[page]
      });
    },
    logout() {
      common_vendor.index.removeStorageSync("token");
      common_vendor.index.removeStorageSync("cookies");
      common_vendor.index.reLaunch({
        url: "/pages/Load/Load"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.publishingCount),
    b: common_vendor.o(($event) => $options.navigateTo("myPublish")),
    c: common_vendor.t($data.collectionCount),
    d: common_vendor.o(($event) => $options.navigateTo("myCollection")),
    e: common_vendor.t($data.messageCount),
    f: $data.messageCount > 99
  }, $data.messageCount > 99 ? {} : {}, {
    g: common_vendor.o(($event) => $options.navigateTo("messageCenter")),
    h: common_vendor.o(($event) => $options.navigateTo("myPublish")),
    i: common_vendor.o(($event) => $options.navigateTo("myCollection")),
    j: common_vendor.o(($event) => $options.navigateTo("publishCard")),
    k: common_vendor.o(($event) => $options.navigateTo("accountSettings")),
    l: common_vendor.o(($event) => $options.navigateTo("securityCenter")),
    m: common_vendor.o(($event) => $options.navigateTo("feedback")),
    n: common_vendor.o(($event) => $options.navigateTo("aboutUs")),
    o: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6ae23533"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/personal/personal.js.map
