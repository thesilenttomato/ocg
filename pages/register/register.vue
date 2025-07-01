<template>
  <view class="register-container">
    <image class="logo" src="/static/logo.png"></image>
    <view class="form">
      <view class="input-item">
        <text class="label">账号：</text>
        <input 
          type="text" 
          v-model="account" 
          placeholder="请输入账号" 
          class="input"
        />
      </view>
      <view class="input-item">
        <text class="label">密码：</text>
        <input 
          type="password" 
          v-model="password" 
          placeholder="请输入密码" 
          class="input"
        />
      </view>
      <view class="input-item">
        <text class="label">确认密码：</text>
        <input 
          type="password" 
          v-model="confirmPassword" 
          placeholder="请确认密码" 
          class="input"
        />
      </view>
      <button class="register-btn" @click="handleRegister">注册</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    handleRegister() {
      // 简单校验
      if (!this.account || !this.password || !this.confirmPassword) {
        uni.showToast({
          title: '账号、密码和确认密码不能为空',
          icon: 'none'
        });
        return;
      }
      if (this.password!== this.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        });
        return;
      }
	  // 发送登录请求
	  uni.request({
	    url: 'http://127.0.0.1:8080/user/register',
	    method: 'POST',
	    data: { account: this.account, password: this.password },
	    header: {
	      'Content-Type': 'application/x-www-form-urlencoded'
	    },
	    success: (res) => { 
	      if (res.data.code === 0) {
	        uni.showToast({
	          title: '注册成功',
	          icon: 'success'
	        });
	        uni.navigateBack();
	      } else {
	        uni.showToast({
	          title: res.data.message,
	          icon: 'none'
	        });
	      }
	    },
	    fail: (err) => {
	      console.error('注册请求失败:', err);
	      uni.showToast({
	        title: '网络请求失败',
	        icon: 'none'
	      });
	    }
	  });
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100rpx;
  background-color: #fff;
  min-height: 100vh;
}
.logo {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 50rpx;
}
.form {
  width: 80%;
}
.input-item {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  border-bottom: 1px solid #eee;
  padding-bottom: 10rpx;
}
.label {
  width: 150rpx;
  font-size: 32rpx;
}
.input {
  flex: 1;
  font-size: 28rpx;
}
.register-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #E5484D;
  color: #fff;
  font-size: 32rpx;
  border-radius: 10rpx;
  margin-top: 50rpx;
}
</style>