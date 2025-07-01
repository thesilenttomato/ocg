<template>
  <view class="login-container">
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
      <button class="login-btn" @click="handleLogin">登录</button>
      <view class="register-link" @click="gotoRegister">还没有账号？去注册</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      account: '',
      password: ''
    };
  },
  methods: {
	  gotoRegister(){
	  	uni.navigateTo({
	  	  url: `/pages/register/register`
	  	});
	  },
    handleLogin() {
      // 表单校验
      if (!this.account || !this.password) {
        uni.showToast({
          title: '账号和密码不能为空',
          icon: 'none'
        });
        return;
      }
      // 发送登录请求
      uni.request({
        url: 'http://127.0.0.1:8080/user/login',
        method: 'POST',
        data: { account: this.account, password: this.password },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true, // 允许携带凭证
        success: (res) => {
          const setCookie = res.header['set-cookie'] || res.header['Set-Cookie'];
          
          if (setCookie) {
            const cookies = Array.isArray(setCookie) 
              ? setCookie.join('; ') 
              : setCookie;
            uni.setStorageSync('cookies', cookies);
            console.log('获取Cookie:', cookies);
          }
          if (res.data.code === 0) {
            uni.showToast({
              title: '登录成功',
              icon: 'success'
            });
            setTimeout(() => {
              uni.switchTab({ 
                url: '/pages/index/index'
              });
            }, 500);
          } else {
            uni.showToast({
              title: res.data.message,
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('登录请求失败:', err);
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
.login-container {
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
  width: 120rpx;
  font-size: 32rpx;
}
.input {
  flex: 1;
  font-size: 28rpx;
}
.login-btn {
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
.register-link {
  text-align: center;
  margin-top: 30rpx;
  color: #007aff;
  font-size: 28rpx;
}
</style>