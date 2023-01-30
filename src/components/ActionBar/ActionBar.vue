<!-- 操作栏 -->

<template>
  <div class="action-bar-box">
    <i
      class="iconfont"
      v-for="(item, index) in initData"
      :key="index"
      :title="item.title"
      v-html="item.icon"
      @click="handleClick(index)"
    ></i>
    <Instructions />
  </div>
  <input type="file" id="file-select" @change="handleUploadFile" />
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import { dataFormat, initData } from './index';
import { emitter } from '../../hooks/useMitt';
import { uploadFile, downloadFile } from '@/utils/file';
import createMessage from '@/baseComponents/Message';
import Instructions from '@/components/Instructions/Instructions.vue';
import localforage from 'localforage';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
});

// 点击图标处理事件
const handleClick = (index: number) => {
  // 添加标签
  if (index === 0) {
    emitter.emit('add-label');
  }
  // 进入编辑模式
  if (index === 1) {
    emit('update:modelValue', true);
    createMessage('已进入编辑模式，点击右下角即可退出 !');
  }
  // 上传文件
  if (index === 2) {
    // 获取input元素，点击触发上传操作
    const input = document.querySelector('#file-select') as HTMLInputElement;
    input.click();
  }
  // 下载文件
  if (index === 3) {
    // 从浏览器中读取添加书签数据
    localforage.getItem('WARBLER_DATA').then((res) => {
      if (res) {
        downloadFile(res);
      } else {
        downloadFile('');
      }
    });
  }
  // 打开帮助弹窗
  if (index === 4) {
    emitter.emit('open-instructions-dialog');
  }
};

// 触发文件上传 (目前方法存在问题)
const handleUploadFile = (e: Event) => {
  uploadFile(e).then((ev: any) => {
    // 判断上传的数据格式是否为本系统所需格式
    try {
      // 把 json 字符串转换成 JSON 对象
      const jsonObj = JSON.parse(ev.target.result);
      // 验证JSON格式是否为所需格式
      const test = () => {
        let flag = true;
        dataFormat.forEach((dataItem) => {
          const result = Object.keys(jsonObj).find((jsonItem) => dataItem === jsonItem);
          if (!result) {
            flag = false;
          }
        });
        return flag;
      };
      if (!test()) {
        // 数据格式不正确
        createMessage('请上传本网站支持的json格式的文件数据 !');
        return;
      }
    } catch (error) {
      createMessage('请上传本网站支持的json格式的文件数据 !');
    }
  });
};
</script>

<style lang="scss" scoped>
.action-bar-box {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0;
  justify-content: space-evenly;
  align-items: center;

  i {
    color: var(--theme-main);
    cursor: pointer;
  }
}
#file-select {
  visibility: hidden;
}
</style>
