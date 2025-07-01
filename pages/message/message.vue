<template>
  <view class="message-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">消息中心</text>
    </view>

    <!-- 接收者输入 -->
    <view class="input-group">
      <text class="input-label">发送给用户ID：</text>
      <input 
        class="input" 
        v-model="receiverId" 
        placeholder="输入接收者ID" 
        type="number"
      />
    </view>

    <!-- 消息列表 -->
    <scroll-view class="message-list" scroll-y>
      <view 
        class="message-item" 
        v-for="(message, index) in messages" 
        :key="index"
        :class="{ 'my-message': message.buyerId === myId }"
      >
        <view class="message-header">
          <text class="user-info">
            {{ message.buyerId === myId ? 
              `我 → 用户${message.sellerId}` : 
              `用户${message.buyerId} → 我` }}
          </text>
          <text class="time">{{formatTime(message.creatTime)}}</text>
        </view>
        <text class="message-content">{{message.message}}</text>
      </view>

      <view class="empty-tip" v-if="messages.length === 0">
        <text>暂无消息记录</text>
      </view>
    </scroll-view>

    <!-- 消息输入 -->
    <view class="message-input">
      <input 
        class="input" 
        v-model="messageContent" 
        placeholder="输入消息内容..." 
        @confirm="sendMessage"
      />
      <button class="send-btn" @click="sendMessage">发送</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      myId: uni.getStorageSync('userId') || 1,  
      receiverId: '',      
      messageContent: '',  
      messages: []        
    }
  },
  onShow() {
    this.loadMessages()
  },
  methods: {
    // 格式化时间
    formatTime(time) {
      return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },

    // 加载消息记录
    async loadMessages() {
      try {
        const res = await uni.request({
          url: 'http://127.0.0.1:8080/post/get',
          method: 'GET',
          data: { 
            userId: this.myId 
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': uni.getStorageSync('cookies')
          }
        })

        const resData = res[1]?.data || res.data
        if (resData?.code === 0) {
          this.messages = resData.data || []
          // 按时间倒序排列
          this.messages.sort((a, b) => new Date(b.creatTime) - new Date(a.creatTime))
        }
      } catch (error) {
        uni.showToast({ title: '加载消息失败', icon: 'none' })
      }
    },

    // 发送消息
    async sendMessage() {
      if (!this.receiverId || !this.messageContent.trim()) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' })
        return
      }

      try {
        uni.showLoading({ title: '发送中...' })
        
        const res = await uni.request({
          url: 'http://127.0.0.1:8080/post/send',
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': uni.getStorageSync('cookies')
          },
          data: {
            message: this.messageContent,
            sellerId: this.receiverId,  
            buyerId: this.myId          
          }
        })

        const resData = res[1]?.data || res.data
        if (resData?.code === 0) {
          // 添加到消息列表顶部
          this.messages.unshift({
            message: this.messageContent,
            sellerId: this.receiverId,
            buyerId: this.myId,
            creatTime: new Date().toISOString()
          })
          this.messageContent = ''
          uni.showToast({ title: '发送成功', icon: 'success' })
        }
      } catch (error) {
        uni.showToast({ title: '发送失败: ' + (error.message || ''), icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    }
  }
}
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.header {
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.input-group {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 15rpx;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
}

.input-label {
  font-size: 28rpx;
  margin-right: 15rpx;
}

.message-list {
  flex: 1;
  margin-bottom: 140rpx;
}

.message-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 15rpx;
}

.my-message {
  background-color: #e1f5fe;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.user-info {
  font-weight: bold;
  color: #333;
}

.time {
  color: #999;
  font-size: 24rpx;
}

.message-content {
  font-size: 28rpx;
}

.empty-tip {
  text-align: center;
  padding: 100rpx;
  color: #999;
}

.message-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
  display: flex;
}

.input {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  margin-right: 15rpx;
}

.send-btn {
  width: 120rpx;
  height: 70rpx;
  background-color: #07c160;
  color: #fff;
  border-radius: 35rpx;
}
</style>