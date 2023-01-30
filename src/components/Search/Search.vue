<!-- 搜索组件 -->

<template>
  <div class="search-box">
    <!-- 输入框区域 -->
    <div class="content">
      <input
        type="text"
        class="search-input"
        :maxlength="100"
        placeholder="请输入搜索内容"
        v-model="state.value"
        @keyup.enter="handleClick('baidu')"
      />
    </div>
    <!-- 图标区域 -->
    <div class="icons">
      <i
        class="iconfont"
        v-for="(item, index) in initData"
        :key="index"
        v-html="item.icon"
        :title="item.title"
        @click="handleClick(item.type)"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { initData, SearchType } from './index';

const state = reactive({
  value: '',
  initData: initData,
});

const handleClick = (type: SearchType) => {
  if (type === 'baidu') {
    window.open(`https://www.baidu.com/s?ie=utf-8&word=${state.value}`);
  }
  if (type === 'biying') {
    window.open(`https://cn.bing.com/search?q=${state.value}`);
  }
  if (type === 'google') {
    window.open(`https://www.google.com/search?q=${state.value}`);
  }
  if (type === 'fanyi') {
    window.open(
      `https://fanyi.baidu.com/translate?aldtype=16047&query=${state.value}&keyfrom=baidu&smartresult=dict&lang=auto2zh`
    );
  }
};
</script>

<style lang="scss" scoped>
.search-box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    .search-input {
      position: absolute;
      top: 20px;
      left: 150px;
      width: 400px;
      outline: none;
      border: none;
      border-bottom: 1px solid #ccc;
      padding: 13px 15px;
      font-size: 28px;
      color: var(--theme--main);
      text-align: center;
      background-color: transparent;

      &::-webkit-input-placeholder {
        color: #585c89;
      }
    }
  }

  .icons {
    margin-left: 450px;
    i {
      cursor: pointer;
      margin: 0 10px;
    }
  }
}
</style>
