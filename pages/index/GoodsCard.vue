<template>
  <!-- 商品卡片组件，接收单个商品数据 -->
  <view class="goods-card"@click="navigateToDetail">
    <!-- 商品图片 -->
    <image 
      class="goods-img" 
      :src="goods.cardGraph" 
      mode="aspectFill"
    ></image>
    <!-- 商品标题 -->
    <view class="goods-title">{{ goods.name }}</view>
    <view class="goods-info">
      <text class="price">¥{{ goods.price }}</text>
      <view class="extra">
       {{ goods.cardNumber }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "GoodsCard",
  // 接收父组件传递的商品数据
  props: {
    goods: {
      type: Object,
      required: true,
    }
  },  
  methods: {
    navigateToDetail() {
      // 跳转到详情页，携带商品ID
      uni.navigateTo({
        url: `/pages/GoodsDetail/GoodsDetail?id=${this.goods.id}` 
      });
	  console.log("携带的id为："+this.goods.id)
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-card {
  width: 220rpx; 
  margin: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
  overflow: hidden;
  .goods-img {
    width: 100%;
    height: 240rpx; 
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