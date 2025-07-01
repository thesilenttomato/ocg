"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      goods: {
        attention: 0,
        cardGraph: "空",
        name: "示例商品名称示例商品名称",
        rarity: "superBigCup",
        price: 99.9,
        cardNumber: "ABC123456",
        sellerId: "101",
        id: null,
        isCollected: false
      },
      allGoodsList: [],
      collectedGoodsList: [],
      messageContent: ""
    };
  },
  methods: {
    // 获取用户收藏列表
    getCollectedCards() {
      const cookies = common_vendor.index.getStorageSync("cookies");
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/userFavorite/get",
        method: "POST",
        header: {
          "Cookie": cookies
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.collectedGoodsList = res.data.data || [];
            if (this.goods.id) {
              this.checkCollectionStatus();
            }
          }
        }
      });
    },
    // 检查当前商品的收藏状态
    checkCollectionStatus() {
      if (!this.goods.id || !this.collectedGoodsList.length) {
        this.goods.isCollected = false;
        return;
      }
      const isCollected = this.collectedGoodsList.some(
        (item) => String(item.id) === String(this.goods.id)
      );
      this.goods.isCollected = isCollected;
      common_vendor.index.__f__("log", "at pages/GoodsDetail/GoodsDetail.vue:105", "收藏状态检查:", this.goods.id, isCollected);
    },
    // 获取所有商品数据
    getAllCards() {
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/cards/get",
        method: "GET",
        success: (res) => {
          if (res.data.code === 0) {
            this.allGoodsList = res.data.data;
            if (this.goods.id) {
              this.findGoodsById(this.goods.id);
            }
          }
        }
      });
    },
    // 根据ID查找商品并赋值
    findGoodsById(id) {
      if (!id || !this.allGoodsList.length)
        return;
      const targetGoods = this.allGoodsList.find(
        (item) => String(item.id) === String(id)
      );
      if (targetGoods) {
        this.goods = {
          ...targetGoods,
          isCollected: this.goods.isCollected
          // 保持原有的收藏状态
        };
        this.checkCollectionStatus();
      }
    },
    Buy() {
      const cookies = common_vendor.index.getStorageSync("cookies");
      common_vendor.index.request({
        url: `http://127.0.0.1:8080/cards/buy`,
        method: "POST",
        data: { id: this.goods.id },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": cookies
        },
        success: (res) => {
          if (res.data && res.data.code === 0) {
            common_vendor.index.showToast({ title: "购买成功", icon: "success" });
          } else {
            common_vendor.index.showToast({
              title: res.data && res.data.message || "购买失败",
              icon: "none"
            });
          }
        }
      });
    },
    toggleCollect() {
      const cookies = common_vendor.index.getStorageSync("cookies");
      if (!this.goods.id) {
        common_vendor.index.showToast({ title: "商品ID不存在", icon: "none" });
        return;
      }
      if (this.goods.isCollected) {
        common_vendor.index.__f__("log", "at pages/GoodsDetail/GoodsDetail.vue:173", "取消收藏");
        common_vendor.index.request({
          url: `http://127.0.0.1:8080/cards/collect/delete`,
          method: "POST",
          data: { cardId: this.goods.id },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookies
          },
          success: (res) => {
            if (res.data && res.data.code === 0) {
              this.goods.isCollected = false;
              this.collectedGoodsList = this.collectedGoodsList.filter(
                (item) => item.id.toString() !== this.goods.id.toString()
              );
              common_vendor.index.showToast({ title: "已取消收藏", icon: "success" });
            } else {
              common_vendor.index.showToast({
                title: res.data && res.data.message || "取消收藏失败",
                icon: "none"
              });
            }
          }
        });
      } else {
        common_vendor.index.__f__("log", "at pages/GoodsDetail/GoodsDetail.vue:199", "添加收藏");
        common_vendor.index.request({
          url: `http://127.0.0.1:8080/cards/collect/add`,
          method: "POST",
          data: { id: this.goods.id },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookies
          },
          success: (res) => {
            if (res.data && res.data.code === 0) {
              this.goods.isCollected = true;
              this.collectedGoodsList.push({ ...this.goods });
              common_vendor.index.showToast({ title: "收藏成功", icon: "success" });
            } else {
              common_vendor.index.__f__("log", "at pages/GoodsDetail/GoodsDetail.vue:214", "服务器响应:", res.data);
              common_vendor.index.showToast({
                title: res.data && res.data.message || "收藏失败",
                icon: "none"
              });
            }
          }
        });
      }
    },
    sendMessage() {
      if (!this.messageContent.trim()) {
        common_vendor.index.showToast({
          title: "消息内容不能为空",
          icon: "none"
        });
        return;
      }
      const cookies = common_vendor.index.getStorageSync("cookies");
      common_vendor.index.__f__("log", "at pages/GoodsDetail/GoodsDetail.vue:234", this.messageContent);
      common_vendor.index.request({
        url: "http://127.0.0.1:8080/post/send",
        method: "POST",
        data: {
          sellerId: this.goods.sellerId,
          message: this.messageContent
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cookie": cookies
        },
        success: (res) => {
          if (res.data.code === 0) {
            common_vendor.index.showToast({
              title: "消息发送成功",
              icon: "success"
            });
            this.messageContent = "";
          } else {
            common_vendor.index.__f__("log", "at pages/GoodsDetail/GoodsDetail.vue:254", res.data);
            common_vendor.index.showToast({
              title: res.data.message || "消息发送失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/GoodsDetail/GoodsDetail.vue:262", "发送消息失败:", err);
          common_vendor.index.showToast({
            title: "网络错误，发送失败",
            icon: "none"
          });
        }
      });
    }
  },
  updated() {
    common_vendor.index.__f__("log", "at pages/GoodsDetail/GoodsDetail.vue:272", "组件已更新，当前商品收藏状态:", this.goods.isCollected);
  },
  onLoad(options) {
    if (options.id) {
      this.goods.id = options.id;
      this.getCollectedCards();
      this.getAllCards();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.goods.cardGraph,
    b: common_vendor.t($data.goods.name),
    c: common_vendor.t($data.goods.rarity),
    d: common_vendor.t($data.goods.cardNumber),
    e: common_vendor.t($data.goods.sellerId),
    f: common_vendor.t($data.goods.price || "暂无价格"),
    g: common_vendor.t($data.goods.isCollected ? "⭐" : "☆"),
    h: common_vendor.t($data.goods.isCollected ? "已收藏" : "收藏"),
    i: $data.goods.isCollected ? 1 : "",
    j: common_vendor.o((...args) => $options.toggleCollect && $options.toggleCollect(...args)),
    k: common_vendor.o((...args) => $options.Buy && $options.Buy(...args)),
    l: $data.messageContent,
    m: common_vendor.o(($event) => $data.messageContent = $event.detail.value),
    n: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/GoodsDetail/GoodsDetail.js.map
