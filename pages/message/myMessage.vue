<template>
  <view class="message-container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">我的消息</text>
      <text class="refresh" @click="loadMessages">刷新</text>
    </view>

    <!-- 消息列表 -->
    <scroll-view class="message-list" scroll-y>
      <view 
        class="message-item" 
        v-for="(message, index) in messages" 
        :key="index"
      >
        <view class="message-header">
          
          <text class="sender">用户 {{message.buyerId}} → 用户 {{message.sellerId}}</text>
          <text class="time">{{formatTime(message.creatTime)}}</text>
        </view>
        <text class="message-content">{{message.message}}</text>
      </view>

      <view v-if="loading" class="loading-tip">
        <text>加载中...</text>
      </view>
      
      <view v-if="messages.length === 0 && !loading" class="empty-tip">
        <text>暂无消息记录</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      myId: uni.getStorageSync('userId') || 1, 
      messages: [], 
      loading: false 
    }
  },
  onShow() {
    this.loadMessages()
  },
  methods: {
    // 格式化时间
    formatTime(time) {
      if (!time) return ''
      const date = new Date(time)
      const pad = num => num.toString().padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    },
    
    // 加载消息
    async loadMessages() {
      this.loading = true
      try {
        // 获取当前用户作为接收者的所有消息
        const res = await new Promise((resolve, reject) => {
          uni.request({
            url: 'http://127.0.0.1:8080/post/get',
            method: 'GET',
            data: {
              sellerId: this.myId 
            },
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
          this.messages = Array.isArray(responseData.data) ? responseData.data : []
          // 按时间倒序排列
          this.messages.sort((a, b) => new Date(b.creatTime) - new Date(a.creatTime))
          
          console.log('消息数据:', this.messages) 
        }
      } catch (error) {
        console.error('加载失败:', error)
        uni.showToast({
          title: '加载失败: ' + (error.message || '未知错误'),
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* 样式 */
.message-container {
  height: 100vh;
  background-color: #f8f8f8;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.refresh {
  color: #07c160;
  font-size: 14px;
}

.message-list {
  padding: 10px;
  height: calc(100vh - 60px);
}

.message-item {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sender {
  font-weight: bold;
  color: #333;
}

.time {
  color: #999;
  font-size: 12px;
}

.message-content {
  color: #333;
  line-height: 1.5;
}

.loading-tip, .empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
}
</style>