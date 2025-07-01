"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      reportForm: {
        reportedUserId: "",
        type: "",
        content: ""
      },
      reportTypes: [
        "不当言论",
        "欺诈行为",
        "骚扰他人",
        "虚假信息",
        "其他违规"
      ]
    };
  },
  computed: {
    canSubmit() {
      return this.reportForm.reportedUserId && this.reportForm.type && this.reportForm.content.length >= 5;
    }
  },
  methods: {
    handleTypeChange(e) {
      this.reportForm.type = this.reportTypes[e.detail.value];
    },
    submitReport() {
      if (!this.canSubmit)
        return;
      const cookies = common_vendor.index.getStorageSync("cookies");
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/banned/send",
        method: "POST",
        data: {
          banUser: this.reportForm.reportedUserId
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": cookies
        },
        success: (res) => {
          if (res.data.code === 0) {
            common_vendor.index.showToast({ title: "举报成功", icon: "success" });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 500);
          } else {
            common_vendor.index.showToast({
              title: res.data.message || "举报失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "网络错误，请稍后重试",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/Report/Report.vue:122", "举报提交失败:", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.reportForm.reportedUserId,
    b: common_vendor.o(($event) => $data.reportForm.reportedUserId = $event.detail.value),
    c: common_vendor.t($data.reportForm.type || "请选择举报类型"),
    d: $data.reportTypes,
    e: common_vendor.o((...args) => $options.handleTypeChange && $options.handleTypeChange(...args)),
    f: $data.reportForm.content,
    g: common_vendor.o(($event) => $data.reportForm.content = $event.detail.value),
    h: common_vendor.t($data.reportForm.content.length),
    i: !$options.canSubmit,
    j: common_vendor.o((...args) => $options.submitReport && $options.submitReport(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c3fb2e18"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Report/Report.js.map
