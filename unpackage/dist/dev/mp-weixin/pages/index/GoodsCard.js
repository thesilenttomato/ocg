"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "GoodsCard",
  // 接收父组件传递的商品数据
  props: {
    goods: {
      type: Object,
      required: true
    }
  },
  methods: {
    navigateToDetail() {
      common_vendor.index.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?id=${this.goods.id}`
      });
      common_vendor.index.__f__("log", "at pages/index/GoodsCard.vue:37", "携带的id为：" + this.goods.id);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.goods.cardGraph,
    b: common_vendor.t($props.goods.name),
    c: common_vendor.t($props.goods.price),
    d: common_vendor.t($props.goods.cardNumber),
    e: common_vendor.o((...args) => $options.navigateToDetail && $options.navigateToDetail(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f9f5852e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/GoodsCard.js.map
