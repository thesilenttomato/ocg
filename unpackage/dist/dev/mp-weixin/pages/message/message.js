"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      myId: common_vendor.index.getStorageSync("userId") || 1,
      receiverId: "",
      messageContent: "",
      messages: []
    };
  },
  onShow() {
    this.loadMessages();
  },
  methods: {
    // 格式化时间
    formatTime(time) {
      return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },
    // 加载消息记录
    async loadMessages() {
      var _a;
      try {
        const res = await common_vendor.index.request({
          url: "http://127.0.0.1:8080/post/get",
          method: "GET",
          data: {
            userId: this.myId
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": common_vendor.index.getStorageSync("cookies")
          }
        });
        const resData = ((_a = res[1]) == null ? void 0 : _a.data) || res.data;
        if ((resData == null ? void 0 : resData.code) === 0) {
          this.messages = resData.data || [];
          this.messages.sort((a, b) => new Date(b.creatTime) - new Date(a.creatTime));
        }
      } catch (error) {
        common_vendor.index.showToast({ title: "加载消息失败", icon: "none" });
      }
    },
    // 发送消息
    async sendMessage() {
      var _a;
      if (!this.receiverId || !this.messageContent.trim()) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      try {
        common_vendor.index.showLoading({ title: "发送中..." });
        const res = await common_vendor.index.request({
          url: "http://127.0.0.1:8080/post/send",
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": common_vendor.index.getStorageSync("cookies")
          },
          data: {
            message: this.messageContent,
            sellerId: this.receiverId,
            buyerId: this.myId
          }
        });
        const resData = ((_a = res[1]) == null ? void 0 : _a.data) || res.data;
        if ((resData == null ? void 0 : resData.code) === 0) {
          this.messages.unshift({
            message: this.messageContent,
            sellerId: this.receiverId,
            buyerId: this.myId,
            creatTime: (/* @__PURE__ */ new Date()).toISOString()
          });
          this.messageContent = "";
          common_vendor.index.showToast({ title: "发送成功", icon: "success" });
        }
      } catch (error) {
        common_vendor.index.showToast({ title: "发送失败: " + (error.message || ""), icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.receiverId,
    b: common_vendor.o(($event) => $data.receiverId = $event.detail.value),
    c: common_vendor.f($data.messages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.buyerId === $data.myId ? `我 → 用户${message.sellerId}` : `用户${message.buyerId} → 我`),
        b: common_vendor.t($options.formatTime(message.creatTime)),
        c: common_vendor.t(message.message),
        d: index,
        e: message.buyerId === $data.myId ? 1 : ""
      };
    }),
    d: $data.messages.length === 0
  }, $data.messages.length === 0 ? {} : {}, {
    e: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    f: $data.messageContent,
    g: common_vendor.o(($event) => $data.messageContent = $event.detail.value),
    h: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4c1b26cf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
