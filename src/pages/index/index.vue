<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <uni-rate :touchable="false" :value="5" />
    <view>
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
      chartData: {},
    };
  },
  onLoad() {
    this.getServerData();
  },
  methods: {
    getServerData() {
      alert(1);
      //模拟从服务器获取数据时的延时
      setTimeout(() => {
        let res = {
          categories: ["2016", "2017", "2018", "2019", "2020", "2021"],
          series: [
            {
              name: "目标值",
              data: [35, 36, 31, 33, 13, 34],
            },
            {
              name: "完成量",
              data: [18, 27, 21, 24, 6, 28],
            },
          ],
        };
        this.chartData = JSON.parse(JSON.stringify(res));
      }, 500);
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
