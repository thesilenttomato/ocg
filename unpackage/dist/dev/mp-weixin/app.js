"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/Load/Load.js";
  "./pages/index/index.js";
  "./pages/message/message.js";
  "./pages/message/myMessage.js";
  "./pages/card/myPublish.js";
  "./pages/personal/personal.js";
  "./pages/CollectedGoodsCard/CollectedGoodsCard.js";
  "./pages/Search/Search.js";
  "./pages/register/register.js";
  "./pages/card/publish.js";
  "./pages/GoodsDetail/GoodsDetail.js";
  "./pages/Report/Report.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
