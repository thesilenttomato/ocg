<template>
  <view class="search-box">
    <input 
      type="text" 
      v-model="searchText"
      placeholder="🔍搜索卡片" 
      class="search-input"
      @confirm="goToSearch"
      confirm-type="search"
    />
  </view>
  <view class="BigTitle">
    我的收藏
  </view>
  <view class="content">
    <!-- 循环渲染商品卡片 -->
    <view class="goods-list">
      <GoodsCard 
        v-for="(item, index) in goodsList" 
        :key="index" 
        :goods="item"
      />
    </view>
  </view>
</template>

<script>
// 引入商品卡片组件
import GoodsCard from "@/pages/index/GoodsCard.vue";

export default {
  components: {
    GoodsCard
  },
  data() {
    return {
      searchText: '',
      goodsList: []
    };
  },
  methods: {
	  getAllCollectCards() {
	    console.log("getAllCollectCards")
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
	          this.goodsList = res.data.data;
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
    // 跳转到搜索页面
    goToSearch() {
      if (this.searchText.trim()) {
        uni.navigateTo({
          url: `/pages/Search/Search?keyword=${encodeURIComponent(this.searchText.trim())}&isFromCollect=1`
        });
      }
    }
  },
  onShow() {
	  this.getAllCollectCards();},
  onLoad() {
  	this.getAllCollectCards();}
};

</script>

<style lang="scss" scoped>
.search-box {
  padding: 20rpx 30rpx;
  background-color: #ffffff;
}

.search-input {
  width: 90%;
  height: 70rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333;
}
.content {
  padding: 16rpx;
  background-color: #f5f5f5;
}
.BigTitle {
    font-size: 60rpx;          
    font-weight: bold;         
    color: #333;
    margin-left: 10px;
    text-align: left;
    line-height: 64rpx;         
    display: flex;              
    align-items: center;        
    justify-content: flex-start;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>