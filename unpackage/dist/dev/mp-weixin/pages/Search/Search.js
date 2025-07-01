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
      // 搜索文本
      isFromCollect: 0,
      // 是否来自收藏页面，默认为0（全部卡片）
      // 所有卡片列表
      allGoodsList: [],
      // 收藏卡片列表
      collectedGoodsList: []
    };
  },
  computed: {
    // 根据isFromCollect参数选择显示的商品列表
    goodsList() {
      return this.isFromCollect === 1 ? this.collectedGoodsList : this.allGoodsList;
    },
    // 根据搜索关键词过滤商品列表
    filteredGoods() {
      if (!this.searchText)
        return this.goodsList;
      const keyword = this.searchText.toLowerCase();
      return this.goodsList.filter((item) => {
        return item.name.toLowerCase().includes(keyword) || item.cardNumber.toLowerCase().includes(keyword);
      });
    }
  },
  methods: {
    // 执行搜索
    doSearch() {
      common_vendor.index.__f__("log", "at pages/Search/Search.vue:72", "执行搜索:", this.searchText, "是否来自收藏:", this.isFromCollect);
    },
    // 调用后端接口获取热门卡片数据
    getAllCards() {
      common_vendor.index.__f__("log", "at pages/Search/Search.vue:76", "getAllCards");
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/cards/get",
        method: "GET",
        success: (res) => {
          if (res.data.code === 0) {
            this.allGoodsList = res.data.data;
          } else {
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Search/Search.vue:91", "请求失败:", err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
        }
      });
    },
    getCollectedCards() {
      common_vendor.index.__f__("log", "at pages/Search/Search.vue:100", "getCollectedCards");
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
            this.collectedGoodsList = res.data.data;
          } else {
            common_vendor.index.showToast({
              title: "获取数据失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Search/Search.vue:120", "请求失败:", err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
        }
      });
    }
  },
  onLoad(options) {
    this.getAllCards();
    this.getCollectedCards();
    if (options.keyword) {
      this.searchText = decodeURIComponent(options.keyword);
    }
    if (options.isFromCollect !== void 0) {
      this.isFromCollect = parseInt(options.isFromCollect);
    }
    common_vendor.index.__f__("log", "at pages/Search/Search.vue:142", "加载搜索页面:", {
      关键词: this.searchText,
      来自收藏: this.isFromCollect === 1 ? "是" : "否"
    });
  }
};
if (!Array) {
  const _component_GoodsCard = common_vendor.resolveComponent("GoodsCard");
  _component_GoodsCard();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.doSearch && $options.doSearch(...args)),
    b: $data.searchText,
    c: common_vendor.o(($event) => $data.searchText = $event.detail.value),
    d: common_vendor.t($data.isFromCollect === 1 ? "我的收藏" : "搜索结果"),
    e: $data.searchText
  }, $data.searchText ? {
    f: common_vendor.t($data.searchText),
    g: common_vendor.t($data.isFromCollect === 1 ? "收藏" : "搜索结果")
  } : {}, {
    h: common_vendor.f($options.filteredGoods, (item, index, i0) => {
      return {
        a: index,
        b: "a9e5e983-0-" + i0,
        c: common_vendor.p({
          goods: item
        })
      };
    }),
    i: $options.filteredGoods.length === 0
  }, $options.filteredGoods.length === 0 ? {
    j: common_vendor.t($data.isFromCollect === 1 ? "您的收藏中没有符合条件的卡片" : "没有找到符合条件的卡片")
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a9e5e983"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Search/Search.js.map
