<template>
  <view class="publish-container">
    <!-- 标题栏 -->
    <view class="header">
      <text class="title">发布卡牌</text>
      <text class="cancel-btn" @click="cancel">取消</text>
    </view>

    <!-- 表单 -->
    <scroll-view class="form-container" scroll-y>
      
      <view class="form-section">
        <text class="section-title">卡牌图片URL</text>
        <view class="form-item">
          <input 
            class="input" 
            v-model="cardInfo.cardGraph" 
            placeholder="请输入卡牌图片URL"
          />
        </view>
      </view>

      <!-- 卡牌基本信息 -->
      <view class="form-section">
        <text class="section-title">卡牌信息</text>
        <view class="form-item">
          <text class="label">卡牌名称</text>
          <input 
            class="input" 
            v-model="cardInfo.name" 
            placeholder="请输入卡牌名称"
          />
        </view>
        <view class="form-item">
          <text class="label">卡牌编号</text>
          <input 
            class="input" 
            v-model="cardInfo.cardNumber" 
            placeholder="请输入卡牌编号"
            type="number"
          />
        </view>
        <view class="form-item">
          <text class="label">价格</text>
          <input 
            class="input price-input" 
            v-model="cardInfo.price" 
            type="number" 
            placeholder="0.00"
          />
          <text class="currency">¥</text>
        </view>
        <view class="form-item">
          <text class="label">稀有度</text>
          <input 
            class="input" 
            v-model="cardInfo.rarity" 
            placeholder="请输入稀有度"
          />
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="footer">
      <button class="publish-btn" @click="publish">发布</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      cardInfo: {
        cardGraph: '', 
        cardNumber: '',
        name: '',
        price: '',
        rarity: ''
      }
    }
  },
  methods: {
    // 发布卡牌
    checkLogin() {
        const cookies = uni.getStorageSync('cookies');
        if (!cookies) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          });
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            });
          }, 1500);
          return false;
        }
        return true;
      },
      
      
      publish() {
        
        if (!this.checkLogin()) return;
        
        if (!this.validateForm()) return;
        
        uni.showLoading({
          title: '发布中...'
        });
        
        
        const cookies = uni.getStorageSync('cookies');
        
        
        const requestData = {
          cardGraph: this.cardInfo.cardGraph,
          cardNumber: parseInt(this.cardInfo.cardNumber),
          name: this.cardInfo.name,
          price: parseFloat(this.cardInfo.price),
          rarity: this.cardInfo.rarity
        };
        
        
        uni.request({
          url: 'http://127.0.0.1:8080/cards/add',
          method: 'POST',
          data: requestData,
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookies 
          },
          success: (res) => {
            // 处理未授权情况
            if (res.statusCode === 401) {
              uni.showToast({
                title: '登录已过期，请重新登录',
                icon: 'none'
              });
              uni.removeStorageSync('cookies');
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/login/login'
                });
              }, 1500);
              return;
            }
            
            if (res.data.code === 0) {
              uni.showToast({
                title: '发布成功',
                icon: 'success'
              });
              setTimeout(() => {
                uni.navigateBack();
              }, 1500);
            } else {
              uni.showToast({
                title: res.data.message || '发布失败',
                icon: 'none'
              });
            }
          },
          fail: (err) => {
            uni.showToast({
              title: '网络错误，请重试',
              icon: 'none'
            });
            console.error('请求失败:', err);
          },
          complete: () => {
            uni.hideLoading();
          }
        });
      },
    
    // 表单验证
    validateForm() {
      if (!this.cardInfo.cardGraph) {
        uni.showToast({
          title: '请输入卡牌图片URL',
          icon: 'none'
        })
        return false
      }
      
      if (!this.cardInfo.name) {
        uni.showToast({
          title: '请输入卡牌名称',
          icon: 'none'
        })
        return false
      }
      
      if (!this.cardInfo.cardNumber) {
        uni.showToast({
          title: '请输入卡牌编号',
          icon: 'none'
        })
        return false
      }
      
      if (!this.cardInfo.price) {
        uni.showToast({
          title: '请输入价格',
          icon: 'none'
        })
        return false
      }
      
      if (!this.cardInfo.rarity) {
        uni.showToast({
          title: '请输入稀有度',
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    // 取消
    cancel() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.publish-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 头部样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.cancel-btn {
  font-size: 30rpx;
  color: #666;
}

/* 表单容器 */
.form-container {
  flex: 1;
  padding: 20rpx;
}

.form-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  color: #333;
}

/* 表单项目 */
.form-item {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.label {
  width: 180rpx;
  font-size: 28rpx;
  color: #666;
}

.input {
  flex: 1;
  font-size: 28rpx;
  height: 40rpx;
  line-height: 40rpx;
}

.price-input {
  text-align: right;
  padding-right: 40rpx;
}

.currency {
  position: absolute;
  right: 30rpx;
  font-size: 28rpx;
}

/* 底部操作栏 */
.footer {
  display: flex;
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}

.publish-btn {
  flex: 1;
  background-color: #ff6b81;
  color: #fff;
  border-radius: 50rpx;
  font-size: 30rpx;
  height: 80rpx;
  line-height: 80rpx;
}
</style>