"use strict";
const common_vendor = require("../../common/vendor.js");
const GoodsCard = () => "./GoodsCard.js";
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
  onShow() {
    this.getTopCards();
  },
  methods: {
    logCardId(id) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:49", "点击的卡片ID:", id, "类型:", typeof id);
    },
    // 搜索页面的方法
    goToSearch() {
      if (this.searchText.trim()) {
        common_vendor.index.navigateTo({
          url: `/pages/Search/Search?keyword=${encodeURIComponent(this.searchText.trim())}&isFromCollect=0`
        });
      }
    },
    //获取热门卡片数据
    getTopCards() {
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/cards/get/top",
        method: "GET",
        success: (res) => {
          if (res.data.code === 0) {
            this.goodsList = res.data.data.map((item) => ({
              ...item,
              id: BigInt(item.id)
            }));
          } else {
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:80", "请求失败:", err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
        }
      });
    }
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
    d: common_vendor.f($data.goodsList.slice(0, 9), (item, index, i0) => {
      return {
        a: index,
        b: "1cf27b2a-0-" + i0,
        c: common_vendor.p({
          goods: item
        })
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
