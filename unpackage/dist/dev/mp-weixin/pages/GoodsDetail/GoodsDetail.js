"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "GoodsCard",
  // 接收父组件传递的商品数据
  props: {
    goods: {
      type: Object,
      required: true,
      default: () => ({})
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.goods.image,
    b: common_vendor.t($props.goods.title),
    c: common_vendor.t($props.goods.price),
    d: common_vendor.t($props.goods.code),
    e: `/pages/GoodsDetail/GoodsDetail?goodsId=${$props.goods.id}`
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bc56e939"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/GoodsDetail/GoodsDetail.js.map
