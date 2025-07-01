"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      onShelfCards: [],
      isLoading: false,
      isRefreshing: false,
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      cookies: ""
    };
  },
  onShow() {
    this.checkLogin();
    this.refreshData();
  },
  methods: {
    // 检查登录状态
    checkLogin() {
      this.cookies = common_vendor.index.getStorageSync("cookies");
      if (!this.cookies) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 1500);
        return false;
      }
      return true;
    },
    // 刷新数据
    refreshData() {
      this.isRefreshing = true;
      this.currentPage = 1;
      this.hasMore = true;
      this.loadData(true);
    },
    // 加载更多数据
    loadMore() {
      if (!this.isLoading && this.hasMore) {
        this.currentPage++;
        this.loadData();
      }
    },
    // 加载数据
    async loadData(isRefresh = false) {
      if (this.isLoading)
        return;
      this.isLoading = true;
      if (isRefresh) {
        this.onShelfCards = [];
      }
      try {
        const res = await this.request({
          url: "/cards/get/own",
          method: "GET",
          header: {
            "Cookie": this.cookies
          }
        });
        if (res.data.code === 0) {
          const newCards = res.data.data || [];
          if (isRefresh) {
            this.onShelfCards = newCards;
          } else {
            this.onShelfCards = [...this.onShelfCards, ...newCards];
          }
          this.hasMore = newCards.length >= this.pageSize;
        } else if (res.data.code === 401) {
          this.handleUnauthorized();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/card/myPublish.vue:148", "加载数据失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
        this.isRefreshing = false;
      }
    },
    // 访问控制
    handleUnauthorized() {
      common_vendor.index.removeStorageSync("cookies");
      common_vendor.index.showToast({
        title: "登录已过期，请重新登录",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      }, 1500);
    },
    // 下架卡牌
    async offShelf(id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要下架该卡牌吗？",
        success: async (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "处理中..."
            });
            try {
              const result = await this.request({
                url: "/cards/delete",
                method: "POST",
                data: { id },
                header: {
                  "Cookie": this.cookies,
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              });
              if (result.data.code === 0) {
                this.onShelfCards = this.onShelfCards.filter((card) => card.id !== id);
                common_vendor.index.showToast({
                  title: "已下架",
                  icon: "success"
                });
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/card/myPublish.vue:203", "下架失败:", error);
              common_vendor.index.showToast({
                title: "下架失败",
                icon: "none"
              });
            } finally {
              common_vendor.index.hideLoading();
            }
          }
        }
      });
    },
    // 跳转到发布页面
    navigateToPublish() {
      common_vendor.index.navigateTo({
        url: "/pages/card/publish"
      });
    },
    // 请求
    request(options) {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "http://127.0.0.1:8080" + options.url,
          method: options.method || "GET",
          data: options.data || {},
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...options.header
          },
          success: (res) => {
            if (res.statusCode === 401) {
              this.handleUnauthorized();
              reject(new Error("未授权"));
              return;
            }
            resolve(res);
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.onShelfCards, (card, index, i0) => {
      return {
        a: card.cardGraph,
        b: common_vendor.t(card.name),
        c: common_vendor.t(card.price),
        d: common_vendor.t(card.cardNumber),
        e: common_vendor.t(card.rarity || card.parity),
        f: common_vendor.t(card.attention || 0),
        g: common_vendor.o(($event) => $options.offShelf(card.id), index),
        h: index
      };
    }),
    b: $data.onShelfCards.length === 0 && !$data.isLoading
  }, $data.onShelfCards.length === 0 && !$data.isLoading ? {
    c: common_assets._imports_0$1,
    d: common_vendor.o((...args) => $options.navigateToPublish && $options.navigateToPublish(...args))
  } : {}, {
    e: $data.hasMore
  }, $data.hasMore ? {
    f: common_vendor.t($data.isLoading ? "加载中..." : "上拉加载更多")
  } : {}, {
    g: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    h: $data.isRefreshing,
    i: common_vendor.o((...args) => $options.refreshData && $options.refreshData(...args)),
    j: $data.onShelfCards.length > 0
  }, $data.onShelfCards.length > 0 ? {
    k: common_vendor.o((...args) => $options.navigateToPublish && $options.navigateToPublish(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5a79ace0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/card/myPublish.js.map
