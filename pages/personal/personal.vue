<template>
  <view class="personal-container">
    <!-- 用户信息区域 -->
    <view class="user-info-section">
      <view class="user-detail">
        <view class="user-stats">
          <view class="stat-item" @click="navigateTo('myPublish')">
            <text class="stat-value">{{publishingCount}}</text>
            <text class="stat-label">出售中</text>
          </view>
          <view class="stat-item" @click="navigateTo('myCollection')">
            <text class="stat-value">{{collectionCount}}</text>
            <text class="stat-label">收藏</text>
          </view>
          <view class="stat-item" @click="navigateTo('messageCenter')">
            <text class="stat-value">{{messageCount}}</text>
            <text class="stat-label">消息</text>
            <view class="mini-badge" v-if="messageCount > 99"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- 主要功能区 -->
    <view class="main-functions">
      <view class="function-card" @click="navigateTo('myPublish')">
        <view class="function-header">
          <text class="function-icon">📋</text>
          <text class="function-title">我的发布</text>
        </view>
        <text class="function-desc">管理您正在出售的卡牌</text>
        <view class="function-footer">
          <text>查看全部</text>
          <text>›</text>
        </view>
      </view>
      
      <view class="function-card" @click="navigateTo('myCollection')">
        <view class="function-header">
          <text class="function-icon">⭐</text>
          <text class="function-title">我的收藏</text>
        </view>
        <text class="function-desc">查看您收藏的卡牌</text>
        <view class="function-footer">
          <text>查看全部</text>
          <text>›</text>
        </view>
      </view>
      
      <view class="function-card" @click="navigateTo('publishCard')">
        <view class="function-header">
          <text class="function-icon">➕</text>
          <text class="function-title">发布卡牌</text>
        </view>
        <text class="function-desc">出售您的闲置卡牌</text>
        <view class="function-footer">
          <text>立即发布</text>
          <text>›</text>
        </view>
      </view>
    </view>

    <!-- 设置区域 -->
    <view class="settings-section">
      <view class="section-title">账户设置</view>
      <view class="setting-item" @click="navigateTo('accountSettings')">
        <text class="setting-icon">👤</text>
        <text class="setting-text">个人资料</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="navigateTo('securityCenter')">
        <text class="setting-icon">⚠️</text>
        <text class="setting-text">举报与反馈</text>
        <text class="setting-arrow">›</text>
      </view>
      
      <view class="section-title">其他</view>
      <view class="setting-item" @click="navigateTo('feedback')">
        <text class="setting-icon">❓</text>
        <text class="setting-text">帮助中心</text>
        <text class="setting-arrow">›</text>
      </view>
      <view class="setting-item" @click="navigateTo('aboutUs')">
        <text class="setting-icon">ℹ️</text>
        <text class="setting-text">关于我们</text>
        <text class="setting-arrow">›</text>
      </view>
      
      <button class="logout-btn" @click="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      publishingCount: 0,
      messageCount: 0,
      collectionCount: 0,
    }
  },
  onShow() {
	  this.getAllCollectCards()
    this.loadUserCards()
    this.loadMessageCount()
  },
  methods: {
	  getAllCollectCards() {
	  	 	const cookies = uni.getStorageSync('cookies');
	  	   uni.request({
	  	     url: 'http://127.0.0.1:8080/userFavorite/get', 
	  	     method: 'POST',
	  	 	  header: {
	  	 	      'Content-Type': 'application/x-www-form-urlencoded',
	  	 	      'Cookie':  cookies
	  	 	    },
	  	     success: (res) => {
	  	       if (res.data.code === 0) {
	  	         this.collectionCount = res.data.data.length;
	  	       } else {
	  	 			console.log(res.data.code);
	  	         uni.showToast({
	  	           title: '获取数据失败',
	  	           icon: 'none'
	  	         });
	  	       }
	  	     },
	  	     fail: (err) => {
	  	       console.error('请求失败:', err);
	  	       uni.showToast({
	  	         title: '网络请求失败',
	  	         icon: 'none'
	  	       });
	  	     }
	  	   });
	  	 },
    async loadUserCards() {
      try {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: 'http://127.0.0.1:8080/cards/get/own',
            method: 'GET',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Cookie': uni.getStorageSync('cookies')
            },
            success: (res) => {
              if (res.statusCode === 200) {
                resolve(res)
              } else {
                reject(new Error(`请求失败，状态码: ${res.statusCode}`))
              }
            },
            fail: (err) => {
              reject(err)
            }
          })
        })

        const responseData = res.data || {}
        
        if (responseData.code === 0) {
          this.publishingCount = Array.isArray(responseData.data) ? 
            responseData.data.filter(card => card.status === 1).length : 0
        }
      } catch (error) {
        console.error('加载卡牌数据失败:', error)
      }
    },
//卡牌计数
    async loadMessageCount() {
      try {
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: 'http://127.0.0.1:8080/post/get',
            method: 'GET',
            header: {
              'Cookie': uni.getStorageSync('cookies')
            },
            success: (res) => {
              if (res.statusCode === 200) {
                resolve(res)
              } else {
                reject(new Error(`请求失败，状态码: ${res.statusCode}`))
              }
            },
            fail: (err) => {
              reject(err)
            }
          })
        })

        const responseData = res.data || {}
        if (responseData.code === 0) {
          this.messageCount = Array.isArray(responseData.data) ? responseData.data.length : 0
        }
      } catch (error) {
        console.error('获取消息数失败:', error)
      }
    },
    
    navigateTo(page) {
      const routes = {
        'myPublish': '/pages/card/myPublish',
        'publishCard': '/pages/card/publish',
        'myCollection': '/pages/CollectedGoodsCard/CollectedGoodsCard',
        'messageCenter': '/pages/message/myMessage',
        'accountSettings': '/pages/settings/account',
        'securityCenter': '/pages/Report/Report',
        'feedback': '/pages/settings/feedback',
        'aboutUs': '/pages/settings/about'
      }
      uni.navigateTo({
        url: routes[page]
      })
    },
    
    logout() {
      uni.removeStorageSync('token')
      uni.removeStorageSync('cookies')
      uni.reLaunch({
        url: '/pages/Load/Load'
      })
    }
  }
}
</script>

<style scoped>

.personal-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.user-info-section {
  display: flex;
  justify-content: center;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.user-detail {
  width: 100%;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  text-align: center;
}

.username:empty {
  display: none;
}

.user-stats {
  display: flex;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b81;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.mini-badge {
  position: absolute;
  top: -5rpx;
  right: 20rpx;
  width: 16rpx;
  height: 16rpx;
  background-color: #ff4757;
  border-radius: 50%;
}

.main-functions {
  margin-bottom: 20rpx;
}

.function-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 25rpx;
  margin-bottom: 20rpx;
}

.function-header {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.function-icon {
  font-size: 40rpx;
  margin-right: 15rpx;
}

.function-title {
  font-size: 30rpx;
  font-weight: bold;
}

.function-desc {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.function-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  color: #ff6b81;
}

.settings-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 0 20rpx;
}

.section-title {
  font-size: 26rpx;
  color: #999;
  padding: 25rpx 0 15rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.setting-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.setting-text {
  flex: 1;
  font-size: 28rpx;
}

.setting-arrow {
  font-size: 40rpx;
  color: #999;
}

.logout-btn {
  margin: 30rpx 0;
  background-color: #ff4757;
  color: #fff;
  border-radius: 50rpx;
  font-size: 28rpx;
  height: 80rpx;
  line-height: 80rpx;
}
</style>