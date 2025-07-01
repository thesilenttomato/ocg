"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      myId: common_vendor.index.getStorageSync("userId") || 1,
      messages: [],
      loading: false
    };
  },
  onShow() {
    this.loadMessages();
  },
  methods: {
    // 格式化时间
    formatTime(time) {
      if (!time)
        return "";
      const date = new Date(time);
      const pad = (num) => num.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    },
    // 加载消息
    async loadMessages() {
      this.loading = true;
      try {
        const res = await new Promise((resolve, reject) => {
          common_vendor.index.request({
            url: "http://127.0.0.1:8080/post/get",
            method: "GET",
            data: {
              sellerId: this.myId
            },
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
          this.messages = Array.isArray(responseData.data) ? responseData.data : [];
          this.messages.sort((a, b) => new Date(b.creatTime) - new Date(a.creatTime));
          common_vendor.index.__f__("log", "at pages/message/myMessage.vue:92", "消息数据:", this.messages);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/myMessage.vue:95", "加载失败:", error);
        common_vendor.index.showToast({
          title: "加载失败: " + (error.message || "未知错误"),
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.loadMessages && $options.loadMessages(...args)),
    b: common_vendor.f($data.messages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.buyerId),
        b: common_vendor.t(message.sellerId),
        c: common_vendor.t($options.formatTime(message.creatTime)),
        d: common_vendor.t(message.message),
        e: index
      };
    }),
    c: $data.loading
  }, $data.loading ? {} : {}, {
    d: $data.messages.length === 0 && !$data.loading
  }, $data.messages.length === 0 && !$data.loading ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ac69a36c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/myMessage.js.map
