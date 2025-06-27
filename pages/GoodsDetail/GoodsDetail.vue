<template>
  <!-- 商品卡片组件，接收单个商品数据 -->
  <navigator :url="`/pages/GoodsDetail/GoodsDetail?goodsId=${goods.id}`" class="goods-card">
    <!-- 商品图片 -->
    <image 
      class="goods-img" 
      :src="goods.image" 
      mode="aspectFill"
    ></image>
    <!-- 商品标题 -->
    <view class="goods-title">{{ goods.title }}</view>
    <!-- 价格 + 额外信息（集换分、编号等，可按需扩展） -->
    <view class="goods-info">
      <text class="price">¥{{ goods.price }}</text>
      <view class="extra">
       {{ goods.code }}
      </view>
    </view>
  </navigator>
</template>

<script>
export default {
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
</script>

<style lang="scss" scoped>
.goods-card {
  width: 220rpx; /* 卡片宽度，可根据需求调整 */
  margin: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
  overflow: hidden;
  text-decoration: none; /* 去除 navigator 默认下划线 */
  color: inherit; /* 继承父级颜色，避免文字变色 */

  .goods-img {
    width: 100%;
    height: 240rpx; /* 保持图片比例，可按需调整 */
  }

  .goods-title {
    font-size: 32rpx;           
    font-weight: bold;          
    color: #333;
    margin: 12rpx 0 8rpx;
    text-align: center;
    line-height: 44rpx;         
    height: 88rpx;              
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .goods-info {
    width: 100%;
    padding: 0 12rpx 12rpx;
    box-sizing: border-box;

    .price {
      font-size: 32rpx;
      color: #f44336;
      font-weight: bold;
    }

    .extra {
      font-size: 24rpx;
      color: #999;
      margin-top: 4rpx;
    }
  }
}
</style>