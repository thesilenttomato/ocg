<template>
  <view class="my-publish-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">我的上架</text>
    </view>

    <!-- 卡牌列表 -->
    <scroll-view 
      class="card-list" 
      scroll-y
      @scrolltolower="loadMore"
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="refreshData"
    >
      <view 
        class="card-item" 
        v-for="(card, index) in onShelfCards" 
        :key="index"
      >
        <image class="card-image" :src="card.cardGraph" mode="aspectFill"></image>
        <view class="card-info">
          <view class="card-header">
            <text class="card-name">{{card.name}}</text>
            <text class="card-price">¥{{card.price}}</text>
          </view>
          <view class="card-meta">
            <text class="meta-item">编号: {{card.cardNumber}}</text>
            <text class="meta-item">稀有度: {{card.rarity || card.parity}}</text>
          </view>
          <view class="card-footer">
            <text class="attention">关注: {{card.attention || 0}}次</text>
          </view>
        </view>
        <view class="card-actions">
          <button class="action-btn off" @click="offShelf(card.id)">下架</button>
        </view>
      </view>
      
      <view class="empty-tip" v-if="onShelfCards.length === 0 && !isLoading">
        <image src="/static/empty-card.png" mode="aspectFit"></image>
        <text>暂无上架中的卡牌</text>
        <button class="publish-btn" @click="navigateToPublish">发布卡牌</button>
      </view>

      
      <view class="load-more" v-if="hasMore">
        <text>{{isLoading ? '加载中...' : '上拉加载更多'}}</text>
      </view>
      <view class="no-more" v-else>
        <text>没有更多了</text>
      </view>
    </scroll-view>

    <!-- 底部发布按钮 -->
    <view class="publish-btn" @click="navigateToPublish" v-if="onShelfCards.length > 0">
      <text>+ 发布新卡牌</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      onShelfCards: [],  
      isLoading: false,
      isRefreshing: false,
      currentPage: 1,
      pageSize: 10,
      hasMore: true,
      cookies: ''
    }
  },
  onShow() {
    this.checkLogin()
    this.refreshData()
  },
  methods: {
    // 检查登录状态
    checkLogin() {
      this.cookies = uni.getStorageSync('cookies')
      if (!this.cookies) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }, 1500)
        return false
      }
      return true
    },
    
    // 刷新数据
    refreshData() {
      this.isRefreshing = true
      this.currentPage = 1
      this.hasMore = true
      this.loadData(true)
    },
    
    // 加载更多数据
    loadMore() {
      if (!this.isLoading && this.hasMore) {
        this.currentPage++
        this.loadData()
      }
    },
    
    // 加载数据
    async loadData(isRefresh = false) {
      if (this.isLoading) return
      
      this.isLoading = true
      if (isRefresh) {
        this.onShelfCards = []
      }
      
      try {
        const res = await this.request({
          url: '/cards/get/own',
          method: 'GET',
          header: {
            'Cookie': this.cookies
          }
        })
        
        if (res.data.code === 0) {
          const newCards = res.data.data || []
          
          if (isRefresh) {
            this.onShelfCards = newCards
          } else {
            this.onShelfCards = [...this.onShelfCards, ...newCards]
          }
          
          // 判断是否还有更多数据
          this.hasMore = newCards.length >= this.pageSize
        } else if (res.data.code === 401) {
          this.handleUnauthorized()
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({
          title: '加载失败，请重试',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
        this.isRefreshing = false
      }
    },
    
    // 访问控制
    handleUnauthorized() {
      uni.removeStorageSync('cookies')
      uni.showToast({
        title: '登录已过期，请重新登录',
        icon: 'none'
      })
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }, 1500)
    },
    
    // 下架卡牌
    async offShelf(id) {
      uni.showModal({
        title: '提示',
        content: '确定要下架该卡牌吗？',
        success: async (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            })
            
            try {
              const result = await this.request({
                url: '/cards/delete',
                method: 'POST',
                data: { id },
                header: {
                  'Cookie': this.cookies,
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              })
              
              if (result.data.code === 0) {
                this.onShelfCards = this.onShelfCards.filter(card => card.id !== id)
                uni.showToast({
                  title: '已下架',
                  icon: 'success'
                })
              }
            } catch (error) {
              console.error('下架失败:', error)
              uni.showToast({
                title: '下架失败',
                icon: 'none'
              })
            } finally {
              uni.hideLoading()
            }
          }
        }
      })
    },
    
    // 跳转到发布页面
    navigateToPublish() {
      uni.navigateTo({
        url: '/pages/card/publish'
      })
    },
    
    // 请求
    request(options) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: 'http://127.0.0.1:8080' + options.url,
          method: options.method || 'GET',
          data: options.data || {},
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...options.header
          },
          success: (res) => {
            if (res.statusCode === 401) {
              this.handleUnauthorized()
              reject(new Error('未授权'))
              return
            }
            resolve(res)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.my-publish-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.header {
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.card-list {
  flex: 1;
  padding: 20rpx;
}

.card-item {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.card-image {
  width: 180rpx;
  height: 240rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
}

.card-name {
  font-size: 30rpx;
  font-weight: bold;
  flex: 1;
  margin-right: 20rpx;
}

.card-price {
  font-size: 30rpx;
  color: #ff6b81;
  font-weight: bold;
}

.card-meta {
  margin-bottom: 15rpx;
}

.meta-item {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: flex-start;
}

.attention {
  font-size: 22rpx;
  color: #999;
}

.card-actions {
  display: flex;
  flex-direction: column;
  margin-left: 20rpx;
  justify-content: center;
}

.action-btn {
  width: 120rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 24rpx;
  padding: 0;
  border-radius: 30rpx;
}

.off {
  background-color: #fff;
  color: #ff4757;
  border: 1rpx solid #ff4757;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  color: #999;
}

.empty-tip image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-tip text {
  font-size: 28rpx;
  margin-bottom: 30rpx;
}

.empty-tip .publish-btn {
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #ff6b81;
  color: #fff;
  border-radius: 40rpx;
  font-size: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 129, 0.3);
}

.publish-btn {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #ff6b81;
  color: #fff;
  border-radius: 40rpx;
  font-size: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 129, 0.3);
}

.load-more, .no-more {
  text-align: center;
  padding: 20rpx 0;
  font-size: 26rpx;
  color: #999;
}
</style>