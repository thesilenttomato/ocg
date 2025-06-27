<template>
  <view class="content">
    <!-- 循环渲染商品卡片 -->
    <view class="goods-list">
      <GoodsCard 
        v-for="(item, index) in goodsList" 
        :key="index" 
        :goods="item"
      />
    </view>
  </view>
</template>

<script>
// 引入商品卡片组件
import GoodsCard from "@/pages/index/GoodsCard.vue";

export default {
  components: {
    GoodsCard
  },
  data() {
    return {
      // 模拟商品列表数据，字段需和组件 props 匹配
      goodsList: [
        {
          image: "/static/logo.png", // 图片路径，可替换为实际地址
          title: "梦魇曲 崩界之伊布丽丝",
          price: 5,
          score: 10.0,
          code: "LVP3-JP083",
          count: 1
        },{
          image: "/static/logo.png", // 图片路径，可替换为实际地址
          title: "梦魇曲 崩界之伊布丽丝",
          price: 5,
          score: 10.0,
          code: "LVP3-JP083",
          count: 1
        },{
          image: "/static/logo.png", // 图片路径，可替换为实际地址
          title: "梦魇曲 崩界之伊布丽丝",
          price: 5,
          score: 10.0,
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
</script>

<style lang="scss" scoped>
.content {
  padding: 16rpx;
  background-color: #f5f5f5;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>