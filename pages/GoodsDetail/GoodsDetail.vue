<template>
  <view class="container">
    <!-- 商品大图 -->
    <view class="goods-image-container">
      <image :src="goods.cardGraph" mode="aspectFill" class="goods-image" alt="商品图片"></image>
    </view>

    <!-- 商品信息 -->
    <view class="goods-info">
      <view class="goods-title-container">
        <text class="goods-title">{{ goods.name }}</text>
        <text class="goods-rare">{{ goods.rarity }}</text>
      </view>
      <text class="goods-code">编号: {{ goods.cardNumber }}</text>
      <!-- 卖家和价格 -->
      <view class="seller-price-container">
        <text class="seller-name">卖家: {{ goods.sellerId }}</text>
        <text class="goods-price">¥{{ goods.price || '暂无价格' }}</text>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button 
        class="action-button collect-btn" 
        :class="{ 'collected': goods.isCollected }"
        @click="toggleCollect"
      >
        <text class="action-icon">{{ goods.isCollected ? '⭐' : '☆' }}</text>
        <text class="action-text">{{ goods.isCollected ? '已收藏' : '收藏' }}</text>
      </button>
      <button class="action-button report-btn" @click="Buy">
        <text class="action-icon">🛒</text>
        <text class="action-text">购买</text>
      </button>
    </view>
<!--发消息给卖家 -->
    <view class="message-seller">
      <view class="message-title">发消息给卖家</view>
      <textarea 
        class="message-input" 
        placeholder="请输入消息内容..."
        v-model="messageContent"
        auto-height
      ></textarea>
      <button class="send-button" @click="sendMessage">发送</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      goods: {
        attention: 0,
        cardGraph: '空',
        name: '示例商品名称示例商品名称',
        rarity: 'superBigCup',
        price: 99.9, 
        cardNumber: 'ABC123456',
        sellerId: '101',
        id: null,
        isCollected: false
      },
      allGoodsList: [],
      collectedGoodsList: [],
	  messageContent: ''
    }
  },
  methods: {
    // 获取用户收藏列表
    getCollectedCards() {
      const cookies = uni.getStorageSync('cookies');
      uni.request({
        url: 'http://127.0.0.1:8080/userFavorite/get',
        method: 'POST',
        header: {
          'Cookie': cookies
        },
        success: (res) => {
          if (res.data.code === 0) {
            this.collectedGoodsList = res.data.data || [];
            // 重新检查当前商品是否被收藏
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
      
      const isCollected = this.collectedGoodsList.some(item => 
        String(item.id) === String(this.goods.id)
      );
      
      this.goods.isCollected = isCollected;
      console.log('收藏状态检查:', this.goods.id, isCollected);
    },
    
    // 获取所有商品数据
    getAllCards() {
      uni.request({
        url: 'http://127.0.0.1:8080/cards/get', 
        method: 'GET',
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
      if (!id || !this.allGoodsList.length) return;
      
      const targetGoods = this.allGoodsList.find(item => 
        String(item.id) === String(id)
      );
      
      if (targetGoods) {
        this.goods = {
          ...targetGoods,
          isCollected: this.goods.isCollected // 保持原有的收藏状态
        };
        // 再次检查收藏状态
        this.checkCollectionStatus();
      }
    },
    Buy(){
      const cookies = uni.getStorageSync('cookies');
      uni.request({
        url: `http://127.0.0.1:8080/cards/buy`,
        method: 'POST',
        data: { id: this.goods.id },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie':  cookies
          },
          success: (res) => {
              if (res.data && res.data.code === 0) {
                uni.showToast({ title: '购买成功', icon: 'success' });
              } else {
                uni.showToast({ 
                  title: (res.data && res.data.message) || '购买失败', 
                  icon: 'none' 
                });
              }
            }
          });
    },
    
    toggleCollect() {
      const cookies = uni.getStorageSync('cookies');
      if (!this.goods.id) {
        uni.showToast({ title: '商品ID不存在', icon: 'none' });
        return;
      }
      
      if (this.goods.isCollected) {
        // 取消收藏
		console.log("取消收藏"  )
        uni.request({
          url: `http://127.0.0.1:8080/cards/collect/delete`,
          method: 'POST',
          data: { cardId: this.goods.id },
          header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Cookie':  cookies
            },
          success: (res) => {
            if (res.data && res.data.code === 0) {
              this.goods.isCollected = false;
              this.collectedGoodsList = this.collectedGoodsList.filter(
                item => item.id.toString() !== this.goods.id.toString()
              );
              uni.showToast({ title: '已取消收藏', icon: 'success' });
            } else {
              uni.showToast({ 
                title: (res.data && res.data.message) || '取消收藏失败', 
                icon: 'none' 
              });
            }
          }
        });
      } else {
        // 添加收藏
		console.log("添加收藏")
        uni.request({
          url: `http://127.0.0.1:8080/cards/collect/add`,
          method: 'POST',
          data: { id: this.goods.id},
          header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Cookie':  cookies
            },
          success: (res) => {
            if (res.data && res.data.code === 0) {
              this.goods.isCollected = true;
              this.collectedGoodsList.push({...this.goods});
              uni.showToast({ title: '收藏成功', icon: 'success' });
            } else {
              console.log('服务器响应:', res.data);
              uni.showToast({ 
                title: (res.data && res.data.message) || '收藏失败', 
                icon: 'none' 
              });
            }
          }
        });
      }
    },
	    sendMessage() {
	      if (!this.messageContent.trim()) {
	        uni.showToast({
	          title: '消息内容不能为空',
	          icon: 'none'
	        });
	        return;
	      }
	      
	      const cookies = uni.getStorageSync('cookies');
		  console.log(this.messageContent);
	      uni.request({
	        url: 'http://127.0.0.1:8080/post/send',
	        method: 'POST',
	        data: {
	          sellerId: this.goods.sellerId,
	          message: this.messageContent,
	        },
	        header: {
	          'Content-Type': 'application/x-www-form-urlencoded',
	          'Cookie': cookies
	        },
	        success: (res) => {
	          if (res.data.code === 0) {
	            uni.showToast({
	              title: '消息发送成功',
	              icon: 'success'
	            });
	            this.messageContent = '';
	          } else {
				  console.log(res.data);
	            uni.showToast({
	              title: res.data.message || '消息发送失败',
	              icon: 'none'
	            });
	          }
	        },
	        fail: (err) => {
	          console.error('发送消息失败:', err);
	          uni.showToast({
	            title: '网络错误，发送失败',
	            icon: 'none'
	          });
	        }
	      });
	    },
  },
  updated() {
      console.log('组件已更新，当前商品收藏状态:', this.goods.isCollected);
    },
  onLoad(options) {
      if (options.id) {
        this.goods.id = options.id;
        this.getCollectedCards();
        this.getAllCards();
      }
    }
  }
</script>
<style>
.container {
  background-color: #ffffff;
  min-height: 100vh;
}

.goods-image-container {
  width: 100%;
  height: 750rpx;
  background-color: #f5f5f5;
}

.goods-image {
  width: 100%;
  height: 100%;
}

.goods-info {
  padding: 30rpx;
}

.goods-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.goods-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  max-width: 550rpx;
}

.goods-rare {
  font-size: 28rpx;
  color: #ffffff;
  background-color: #ff6600;
  padding: 6rpx 12rpx;
  border-radius: 6rpx;
}

/* 价格 */
.goods-price {
  font-size: 40rpx;
  font-weight: bold;
  color: #ff5500;
  margin: 20rpx 0;
  display: block;
}

.goods-code {
  font-size: 28rpx;
  color: #666666;
  display: block;
  margin-bottom: 20rpx;
}

/* 卖家和价格 */
.seller-price-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.seller-name {
  font-size: 28rpx;
  color: #333333;
}

.goods-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff5500;
}

.action-buttons {
  display: flex;
  justify-content: center;
  padding: 0 30rpx 60rpx;
}

.action-button {
  width: 300rpx;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  transition: all 0.3s; 
}

.collect-btn {
  color: #999999;
  border: 2rpx solid #999999;
  margin-right: 30rpx;
}

.collect-btn.collected {
  color: #ffd700; 
  border-color: #ffd700; 
  background-color: rgba(255, 215, 0, 0.1); 
}

.report-btn {
  color: #000000;
  border: 2rpx solid #ff0000;
}

.action-icon {
  margin-right: 10rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

/* 发消息给卖家 */
.message-seller {
  padding: 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #f5f5f5;
  margin-top: 20rpx;
}

.message-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.message-input {
  width: 100%;
  min-height: 150rpx;
  background-color: #f9f9f9;
  border-radius: 16rpx;
  padding: 20rpx;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
}

.send-button {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #E5484D;
  color: #fff;
  border-radius: 40rpx;
  font-size: 32rpx;
}
</style>