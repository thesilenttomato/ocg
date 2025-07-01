"use strict";
const common_vendor = require("../../common/vendor.js");
const GoodsCard = () => "../index/GoodsCard.js";
const _sfc_main = {
  components: {
    GoodsCard
  },
  data() {
    return {
      searchText: "",
      goodsList: []
    };
  },
  methods: {
    getAllCollectCards() {
      common_vendor.index.__f__("log", "at pages/CollectedGoodsCard/CollectedGoodsCard.vue:43", "getAllCollectCards");
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
            this.goodsList = res.data.data;
          } else {
            common_vendor.index.__f__("log", "at pages/CollectedGoodsCard/CollectedGoodsCard.vue:56", res.data.code);
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/CollectedGoodsCard/CollectedGoodsCard.vue:64", "请求失败:", err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
        }
      });
    },
    // 跳转到搜索页面
    goToSearch() {
      if (this.searchText.trim()) {
        common_vendor.index.navigateTo({
          url: `/pages/Search/Search?keyword=${encodeURIComponent(this.searchText.trim())}&isFromCollect=1`
        });
      }
    }
  },
  onShow() {
    this.getAllCollectCards();
  },
  onLoad() {
    this.getAllCollectCards();
  }
};
if (!Array) {
  const _component_GoodsCard = common_vendor.resolveComponent("GoodsCard");
  _component_GoodsCard();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    b: $data.searchText,
    c: common_vendor.o(($event) => $data.searchText = $event.detail.value),
    d: common_vendor.f($data.goodsList, (item, index, i0) => {
      return {
        a: index,
        b: "70afde7d-0-" + i0,
        c: common_vendor.p({
          goods: item
        })
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-70afde7d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/CollectedGoodsCard/CollectedGoodsCard.js.map
