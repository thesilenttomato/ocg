<template>
  <view class="manage-container">
    <uni-segmented-control 
      :current="currentTab" 
      :values="tabs" 
      @clickItem="onTabClick"
      style-type="text"
      active-color="#2979ff"
    />
    
    <view class="card-list">
      <uni-list>
        <uni-list-item 
          v-for="card in cards" 
          :key="card.id"
          :title="card.name"
          :note="`${card.version} | ${card.rarity} | ${card.condition}`"
          :rightText="`¥${card.price}`"
          clickable
          @click="toCardDetail(card.id)"
        >
          <template v-slot:footer>
            <view class="card-status">
              <text :class="['status-badge', getStatusClass(card.status)]">
                {{getStatusText(card.status)}}
              </text>
              <text class="update-time">{{card.updatedAt}}</text>
            </view>
          </template>
        </uni-list-item>
      </uni-list>
      
      <uni-load-more 
        :status="loadStatus" 
        :content-text="{
          contentdown: '上拉加载更多',
          contentrefresh: '正在加载...',
          contentnomore: '没有更多了'
        }" 
        @clickLoadMore="loadMore"
      />
    </view>
    
    <view class="floating-btn" @click="toPublishCard">
      <uni-icons type="plusempty" size="30" color="#fff"></uni-icons>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      tabs: ['出售中', '已下架', '已售出'],
      cards: [],
      page: 1,
      pageSize: 10,
      loadStatus: 'more',
      statusMap: {
        on_sale: { text: '出售中', class: 'on-sale' },
        off_shelf: { text: '已下架', class: 'off-shelf' },
        sold: { text: '已售出', class: 'sold' }
      }
    }
  },
  onLoad() {
    this.loadCards()
  },
  onPullDownRefresh() {
    this.page = 1
    this.loadCards(true)
  },
  onReachBottom() {
    if (this.loadStatus === 'more') {
      this.loadMore()
    }
  },
  methods: {
    async loadCards(isRefresh = false) {
      try {
        this.loadStatus = 'loading'
        const status = ['on_sale', 'off_shelf', 'sold'][this.currentTab]
        
        const res = await this.$api.get('/card/list', {
          status,
          page: this.page,
          pageSize: this.pageSize
        })
        
        if (isRefresh) {
          this.cards = res.data.list
          uni.stopPullDownRefresh()
        } else {
          this.cards = this.page === 1 ? res.data.list : [...this.cards, ...res.data.list]
        }
        
        this.loadStatus = res.data.list.length < this.pageSize ? 'noMore' : 'more'
      } catch (error) {
        console.error('加载卡牌失败:', error)
        this.loadStatus = 'more'
        if (isRefresh) uni.stopPullDownRefresh()
      }
    },
    loadMore() {
      if (this.loadStatus === 'noMore') return
      this.page++
      this.loadCards()
    },
    onTabClick(e) {
      this.currentTab = e.currentIndex
      this.page = 1
      this.loadCards()
    },
    toCardDetail(id) {
      uni.navigateTo({
        url: `/pages/card/detail?id=${id}&manage=true`
      })
    },
    toPublishCard() {
      uni.navigateTo({
        url: '/pages/card/publish'
      })
    },
    getStatusText(status) {
      return this.statusMap[status]?.text || status
    },
    getStatusClass(status) {
      return this.statusMap[status]?.class || ''
    }
  }
}
</script>

<style lang="scss">
.manage-container {
  padding: 20rpx;
  
  .card-list {
    margin-top: 20rpx;
    
    .card-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10rpx;
      
      .status-badge {
        font-size: 24rpx;
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
        
        &.on-sale {
          background-color: #e1f3d8;
          color: #67c23a;
        }
        
        &.off-shelf {
          background-color: #fdf6ec;
          color: #e6a23c;
        }
        
        &.sold {
          background-color: #fef0f0;
          color: #f56c6c;
        }
      }
      
      .update-time {
        font-size: 24rpx;
        color: #999;
      }
    }
  }
  
  .floating-btn {
    position: fixed;
    right: 40rpx;
    bottom: 100rpx;
    width: 100rpx;
    height: 100rpx;
    background-color: #2979ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(41, 121, 255, 0.3);
    z-index: 999;
  }
}
</style>