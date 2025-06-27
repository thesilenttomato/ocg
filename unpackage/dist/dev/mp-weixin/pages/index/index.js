"use strict";
const common_vendor = require("../../common/vendor.js");
const GoodsCard = () => "./GoodsCard.js";
const _sfc_main = {
  components: {
    GoodsCard
  },
  data() {
    return {
      // 模拟商品列表数据，字段需和组件 props 匹配
      goodsList: [
        {
          image: "/static/logo.png",
          // 图片路径，可替换为实际地址
          title: "梦魇曲 崩界之伊布丽丝",
          price: 5,
          score: 10,
          code: "LVP3-JP083",
          count: 1
        },
        {
          image: "/static/logo.png",
          // 图片路径，可替换为实际地址
          title: "梦魇曲 崩界之伊布丽丝",
          price: 5,
          score: 10,
          code: "LVP3-JP083",
          count: 1
        },
        {
          image: "/static/logo.png",
          // 图片路径，可替换为实际地址
          title: "梦魇曲 崩界之伊布丽丝",
          price: 5,
          score: 10,
          code: "LVP3-JP083",
          count: 1
        },
        {
          image: "/static/logo.png",
          title: "三战之号",
          price: 220,
          score: 7.7,
          code: "QCAC-JP...",
          count: 2
        },
        {
          image: "/static/logo.png",
          title: "深渊的暗杀者",
          price: 0.8,
          score: "-",
          code: "SD13-JP012 N",
          count: 5
        }
        // 可继续扩展更多商品数据
      ]
    };
  }
};
if (!Array) {
  const _component_GoodsCard = common_vendor.resolveComponent("GoodsCard");
  _component_GoodsCard();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.goodsList, (item, index, i0) => {
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
