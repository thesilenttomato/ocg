<template>
  <view class="search-box">
    <input 
      type="text" 
      v-model="searchText"
      placeholder="搜索卡片" 
      class="search-input"
      @confirm="doSearch"
      confirm-type="search"
    />
  </view>
  <view class="BigTitle">
    {{ isFromCollect === 1 ? '我的收藏' : '搜索结果' }}
  </view>
  <view class="content">
    <!-- 搜索结果提示 -->
    <view class="search-info" v-if="searchText">
      关键词「{{searchText}}」的{{ isFromCollect === 1 ? '收藏' : '搜索结果' }}
    </view>
    <!-- 循环渲染商品卡片 -->
    <view class="goods-list">
      <GoodsCard 
        v-for="(item, index) in filteredGoods"    
        :key="index" 
        :goods="item"
      />
    </view>
    <!-- 无结果提示 -->
    <view class="no-result" v-if="filteredGoods.length === 0">
      {{ isFromCollect === 1 ? '您的收藏中没有符合条件的卡片' : '没有找到符合条件的卡片' }}
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
      searchText: '', // 搜索文本
      isFromCollect: 0, // 是否来自收藏页面，默认为0（全部卡片）
      // 所有卡片列表
      allGoodsList: [],
      // 收藏卡片列表
      collectedGoodsList: []
    };
  },
  computed: {
    // 根据isFromCollect参数选择显示的商品列表
    goodsList() {
      return this.isFromCollect === 1 ? this.collectedGoodsList : this.allGoodsList;
    },
    // 根据搜索关键词过滤商品列表
    filteredGoods() {
      if (!this.searchText) return this.goodsList;
      
      const keyword = this.searchText.toLowerCase();
      return this.goodsList.filter(item => {
        return item.name.toLowerCase().includes(keyword) || 
               item.cardNumber.toLowerCase().includes(keyword);
      });
    }
  },
  methods: {
    // 执行搜索
    doSearch() {
      console.log('执行搜索:', this.searchText, '是否来自收藏:', this.isFromCollect);
    },
	// 调用后端接口获取热门卡片数据
	getAllCards() {
	  console.log("getAllCards")
	  uni.request({
	    url: 'http://127.0.0.1:8080/cards/get', 
	    method: 'GET',
	    success: (res) => {
	      if (res.data.code === 0) {
	        this.allGoodsList = res.data.data;
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
	getCollectedCards(){
		console.log("getCollectedCards")
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
		      this.collectedGoodsList = res.data.data;
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
	}
  },
  onLoad(options) {
    // 获取URL参数
	this.getAllCards();
	this.getCollectedCards();
    if (options.keyword) {
      this.searchText = decodeURIComponent(options.keyword);
    }
    
    // 获取是否来自收藏的参数
    if (options.isFromCollect !== undefined) {
      this.isFromCollect = parseInt(options.isFromCollect);
    }
    
    console.log('加载搜索页面:', {
      关键词: this.searchText,
      来自收藏: this.isFromCollect === 1 ? '是' : '否'
    });
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  padding: 20rpx 30rpx;
  background-color: #ffffff;
}

.search-input {
  width: 100%;
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
  min-height: 80vh;
}

.BigTitle{
  font-size: 60rpx;
  font-weight: bold;
  color: #333;
  margin-left: 10px;
  text-align: left;
  line-height: 64rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-info {
  padding: 20rpx;
  font-size: 28rpx;
  color: #666;
  background-color: #fff;
  margin-bottom: 10rpx;
  border-radius: 8rpx;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.no-result {
  width: 100%;
  padding: 60rpx 0;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}
</style>