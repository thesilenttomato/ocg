<template>
  <view class="report-container">
    <view class="header">
      <text class="title">举报用户</text>
    </view>
    
    <view class="form-container">
      <!-- 被举报用户ID输入 -->
      <view class="form-item">
        <text class="label">被举报用户ID</text>
        <input 
          class="input" 
          type="text" 
          v-model="reportForm.reportedUserId" 
          placeholder="请输入要举报的用户ID"
          placeholder-class="placeholder"
        />
      </view>
      
      <!-- 举报类型选择 -->
      <view class="form-item">
        <text class="label">举报类型</text>
        <picker 
          mode="selector" 
          :range="reportTypes" 
          @change="handleTypeChange"
        >
          <view class="picker">
            {{ reportForm.type || '请选择举报类型' }}
          </view>
        </picker>
      </view>
      
      <!-- 举报详情 -->
      <view class="form-item">
        <text class="label">举报详情</text>
        <textarea 
          class="textarea" 
          v-model="reportForm.content" 
          placeholder="请详细描述举报原因(至少5个字)"
          placeholder-class="placeholder"
          maxlength="500"
        ></textarea>
        <text class="word-count">{{ reportForm.content.length }}/500</text>
      </view>
      
      <!-- 提交按钮 -->
      <button 
        class="submit-btn" 
        :disabled="!canSubmit" 
        @click="submitReport"
      >
        提交举报
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      reportForm: {
        reportedUserId: '',
        type: '',
        content: ''
      },
      reportTypes: [
        '不当言论',
        '欺诈行为',
        '骚扰他人',
        '虚假信息',
        '其他违规'
      ],
    }
  },
  computed: {
    canSubmit() {
      return (
        this.reportForm.reportedUserId &&
        this.reportForm.type &&
        this.reportForm.content.length >= 5
      )
    }
  },
  methods: {
    handleTypeChange(e) {
      this.reportForm.type = this.reportTypes[e.detail.value]
    },
    
    submitReport() {
      if (!this.canSubmit) return
      const cookies = uni.getStorageSync('cookies')
      uni.request({
        url: 'http://127.0.0.1:8080/banned/send',
        method: 'POST',
        data: {
          banUser: this.reportForm.reportedUserId,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookies 
        },
        success: (res) => {
          if (res.data.code === 0) {
            uni.showToast({ title: '举报成功', icon: 'success' })
            setTimeout(() => {
              uni.navigateBack()
            }, 500)
          } else {
            uni.showToast({
              title: res.data.message || '举报失败',
              icon: 'none'
            })
          }
        },
        fail: (err) => {
          uni.showToast({
            title: '网络错误，请稍后重试',
            icon: 'none'
          })
          console.error('举报提交失败:', err)
        },
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.report-container {
  padding: 30rpx;
  background-color: #F5F5F5;
  min-height: 100vh;
}

.header {
  margin-bottom: 30rpx;
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }
}

.form-container {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.form-item {
  margin-bottom: 30rpx;
  .label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 15rpx;
    font-weight: 500;
  }
}

.input, .picker {
  width: 94%;
  height: 70rpx;
  line-height: 70rpx;
  padding: 0 20rpx;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  font-size: 28rpx;
  background-color: #fff;
}

.picker {
  color: #999;
}

.textarea {
  width: 94%;
  height: 180rpx;
  padding: 20rpx;
  border: 1rpx solid #E5E5E5;
  border-radius: 8rpx;
  font-size: 28rpx;
  background-color: #fff;
}

.word-count {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.submit-btn {
  margin-top: 40rpx;
  background-color: #E5484D;
  color: #fff;
  border: none;
  border-radius: 45rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
  
  &[disabled] {
    background-color: #F2CDCD;
    color: #fff;
  }
}

.placeholder {
  color: #999;
  font-size: 28rpx;
}
</style>