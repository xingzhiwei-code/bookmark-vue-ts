<!-- 收藏夹组件 -->

<template>
  <!-- 组件根节点 -->
  <div class="my-book-mark">
    <!-- 左侧标签栏 -->
    <div class="left-part">
      <div class="left-top-part">
        <img class="logo" src="../../assets/logo.png" />
      </div>
      <div class="left-middle-part">
        <LabelList
          @change-label-index="changeLabelIndex"
          :current-id="currentId"
          :label-list="state.warbleData"
          @change-label="changeLabel"
          @add-label="addLabel"
          @delete-label="deleteLabel"
          @update-label="updateLabel"
          :edit-mode="state.editMode"
        />
      </div>
      <div class="left-bottom-part">
        <ActionBar v-model="state.editMode" />
      </div>
    </div>
    <!-- 右侧详情栏 搜索栏 -->
    <div class="right-part">
      <!-- 上方搜索栏 -->
      <div class="right-top-part">
        <Search />
      </div>
      <!-- 列表详情部分 -->
      <div class="right-middle-part">
        <MarkList
          :mark-list="markList"
          @add-mark="addMark"
          @delete-mark="deleteMark"
          @update-mark="updateMark"
          :edit-mode="state.editMode"
          @change-mark-index="changeMarkIndex"
        />
      </div>
      <div class="right-bottom-part">
        <div class="quit-edit-mode" v-if="state.editMode" @click="editModeFn">退出编辑模式</div>
        <div class="motto-text">「 {{ state.motto }} 」</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onUnmounted } from 'vue';
import { initData, BookmarkState, getMotto } from '@/components/Bookmark/index';
import { LabelListProps } from 'coms/LabelList/index';
import { emitter } from '@/hooks/useMitt';
import createMessage from '@/baseComponents/Message';
import ActionBar from '../ActionBar/ActionBar.vue';
import LabelList from '../LabelList/LabelList.vue';
import MarkList from '../MarkList/MarkList.vue';
import Search from '../Search/Search.vue';
import localforage from 'localforage';
import useLabels from './useLabels';
import useMarks from './useMarks';

const state = reactive<BookmarkState>({
  // 整个项目所需的数据，如果localFroge里面有则取，没有就用初始值:initData
  warbleData: [],
  // 是否启用编辑模式
  editMode: false,
  // 座右铭
  motto: getMotto(),
});

// 获取初始数据
localforage.getItem('WARBLER_DATA').then((res) => {
  // 查询数据库 如果存在数据则取值  否则赋值初值
  if (res) {
    const result = JSON.parse(res as string) as LabelListProps;
    state.warbleData = result;
  } else {
    state.warbleData = initData;
  }
});

// 当前标签
const currentId = ref(0);

// 获取当前标签下的所有书签
const markList = computed(() => state.warbleData[currentId.value]?.marks || []);

// 切换标签
const changeLabel = (id: number) => {
  currentId.value = id;
};

// 导出useLabels相关内容
const { addLabel, deleteLabel, updateLabel, changeLabelIndex } = useLabels(state);
// 导出useMarks相关内容
const { addMark, deleteMark, updateMark, changeMarkIndex } = useMarks(markList);

// 把数据存到localForage中，数据变化时，就调取一次存储方法（一开始需立即执行一次）
watch(
  () => state,
  () => {
    localforage.setItem('WARBLER_DATA', JSON.stringify(state.warbleData));
  },
  { immediate: true, deep: true }
);

// 退出编辑模式
const editModeFn = () => {
  state.editMode = false;
  createMessage({ type: 'success', message: '已退出编辑模式 !' });
};

// 更新数据
const updateWarblerData = (warbleData: any) => {
  state.warbleData = warbleData;
  currentId.value = 0;
};

// 监听全局事件，更新数据
emitter.on('update-warblerData', updateWarblerData);
// 显示卸载
onUnmounted(() => {
  emitter.off('update-warblerData', updateWarblerData);
});
</script>

<style lang="scss" scoped>
.my-book-mark {
  position: absolute;
  left: 50%;
  top: 10vh;
  transform: translateX(-50%);
  height: calc(80vh);
  background: var(--glassmorphism--rgba);
  backdrop-filter: var(--glassmorphism-filter);
  border-radius: var(--glassmorphism-radius);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  display: flex;

  .left-part {
    width: 200px;
    height: 100%;
    background: var(--glassmorphism-rgba);
    backdrop-filter: var(--glassmorphism-filter);
    border-radius: var(--glassmorphism-radius) 0 0 var(--glassmorphism-radius);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
    position: relative;

    .left-top-part {
      width: 100%;
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      .logo {
        width: 120px;
      }
    }

    .left-middle-part {
      max-height: calc(100% - 190px);
      overflow: auto;
      //隐藏滚动条
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .left-bottom-part {
      width: 100%;
      height: 40px;
      position: absolute;
      bottom: 0;
    }
  }

  .right-part {
    width: 920px;
    .right-top-part {
      width: 100%;
      height: 100px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.18);
      position: relative;
    }
    .right-middle-part {
      height: calc(100% - 140px);
      overflow: auto;
      padding: 23px 20px;
      //隐藏滚动条
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .right-bottom-part {
      position: relative;
      width: 100%;
      height: 40px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .quit-edit-mode {
        position: relative;
        z-index: 1;
        font-size: 14px;
        color: var(--theme-main);
        cursor: pointer;
      }
      .motto-text {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 10px;
        color: rgba(0, 0, 0, 0.8);
        font-size: 14px;
        text-shadow: 0 0 10px rgb(0 0 0 / 60%);
      }
    }
  }
}
</style>
