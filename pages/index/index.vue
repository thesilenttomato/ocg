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
    热门
  </view>
  
  <view class="content">
    <!-- 循环渲染商品卡片 -->
    <view class="goods-list">
      <GoodsCard 
        v-for="(item, index) in goodsList.slice(0, 9)" 
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
      goodsList: [] ,
    };
  },
  onShow() {
    this.getTopCards();
  },
  methods: {
	  logCardId(id) {
	        console.log('点击的卡片ID:', id, '类型:', typeof id);
	      },
    // 搜索页面的方法
    goToSearch() {
      if (this.searchText.trim()) {
        uni.navigateTo({
          url: `/pages/Search/Search?keyword=${encodeURIComponent(this.searchText.trim())}&isFromCollect=0`
        });
      }
    },
	
    
    //获取热门卡片数据
    getTopCards() {
      uni.request({
        url: 'http://127.0.0.1:8080/cards/get/top', 
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
			this.goodsList = res.data.data.map(item => ({
			          ...item,
			          id: BigInt(item.id)  
			        }));
          } else {
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
  }
};
</script>

<style lang="scss" scoped>
.header-buttons {
  padding: 20rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: flex-end;
}

.add-button {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 10rpx 20rpx;
  font-size: 28rpx;
}

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