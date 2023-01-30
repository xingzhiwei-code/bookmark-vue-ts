<!-- 书签列表组件 -->

<template>
  <div class="mark-list-box">
    <div
      class="mark-item"
      :draggable="editMode"
      v-for="(item, index) in markList"
      :key="index"
      :class="{ isDragging: index === dragState.newItemIndex }"
      @dragstart="handleDragstart(index)"
      @drop.prevent="handleDrop()"
      @dragover.prevent="handleDragover(index)"
      @dragend="handleDragend()"
      @click="inter(item.targetUrl)"
      @mouseenter="changeMark(index)"
      @mouseleave="changeMark(-1)"
    >
      <!-- 图标 -->
      <img :src="item.icon" class="item-icon" />
      <!-- 标题 -->
      <div class="item-info">
        <p class="item-title" :title="item.title">{{ item.title }}</p>
        <p class="item-explain" :title="item.explain">{{ item.explain }}</p>
      </div>
      <!-- 删除和编辑图标 -->
      <div class="edit-icon" v-if="state.currentMark === index && editMode">
        <i class="iconfont" @click.stop="updateMark(item, index)">&#xe623;</i>
        <i class="iconfont" @click.stop="deleteMark(index)">&#xe60f;</i>
      </div>
    </div>
    <!-- 暂无书签提示语 -->
    <div v-if="markList.length < 1 && !editMode" class="no-marks">暂无书签</div>
    <!-- 添加书签 -->
    <transition name="base">
      <div class="mark-item-add" @click="addMark" v-if="editMode">+</div>
    </transition>
  </div>
  <!-- 添加单个书签的弹窗 -->
  <Dialog
    :dialog-visible="dialogFormState.isShowAddMarkDialog"
    @cancle="closeAddMarkDialog"
    @confirm="handleMark(state.handleType)"
    title="添加书签"
    class="add-mark-dialog"
  >
    <x-form ref="form">
      <x-input
        :rules="dialogFormState.targetUrlRules"
        type="text"
        v-model="dialogState.targetUrl"
        placeholder="请输入目标网址"
        padding="30px 30px 20px 30px"
        @change="handChange"
      ></x-input>
      <x-input
        :rules="dialogFormState.titleRules"
        type="text"
        v-model="dialogState.title"
        placeholder="请输入书签名称"
        padding="0px 30px 20px 30px"
      ></x-input>
      <x-input
        :rules="dialogFormState.iconRules"
        type="text"
        v-model="dialogState.icon"
        placeholder="请输入图标地址"
        padding="0px 30px 20px 30px"
      ></x-input>
      <x-input
        type="text"
        v-model="dialogState.explain"
        placeholder="请输入网址简介"
        padding="0px 30px 20px 30px"
      ></x-input>
      <div class="footer">
        <div>
          <div class="auto-get-info">
            <x-button
              title="自动获取网站名称"
              class="auto-btn"
              :use-animation="true"
              :background-color="`rgba(199, 236, 7, 0.3)`"
              @click="autoGetInfo('title')"
            ></x-button>
            <i class="iconfont loading" v-if="dialogFormState.loading1">&#xe61c;</i>
          </div>
          <div class="auto-get-info">
            <x-button
              title="自动获取图标地址"
              class="auto-btn"
              :use-animation="true"
              :background-color="`rgba(199, 236, 7, 0.3)`"
              @click="autoGetInfo('icon')"
            ></x-button>
            <i class="iconfont loading" v-if="dialogFormState.loading2">&#xe61c;</i>
          </div>
        </div>
        <div class="preview-icon">
          <img
            :src="dialogState.icon"
            v-if="dialogState.icon"
            :onerror="`this.src=&quot;//img10.360buyimg.com/imgzone/jfs/t1/189641/13/2583/4231/609a49e5Eecece40b/1c90e5625341897c.png&quot;`"
          />
          <p class="preview-text" v-else>图标</p>
        </div>
      </div>
    </x-form>
  </Dialog>
</template>

<script setup lang="ts">
import createMessage from '@/baseComponents/Message';
import useDrag from '@/hooks/useDraggable';
import { reactive, defineProps, defineEmits, PropType, ref } from 'vue';
import { HandleMarkType, MarkListProps, MarkProps, MarkState } from '.';
import useDialog from './useDialog';
import Dialog from '@/baseComponents/Dialog/Dialog.vue';
import XButton from '@/baseComponents/Button/X-button.vue';
import XForm from '@/baseComponents/Form/X-form.vue';
import XInput from '@/baseComponents/Input/X-input.vue';

const props = defineProps({
  // 书签列表
  markList: {
    type: Array as PropType<MarkListProps>,
    required: true,
    default() {
      return [
        {
          title: 'GitHub',
          icon: '//img10.360buyimg.com/imgzone/jfs/t1/179528/3/5637/3396/60ab1c19Ebb9f2301/0d21547c755c6b84.png',
          targetUrl: 'https://github.com/alanhzw',
          explain: '我的另一个代码托管平台',
        },
      ];
    },
  },
  // 是否为编辑状态
  editMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['add-mark', 'update-mark', 'delete-mark', 'change-mark-index']);

const form = ref<any>(null);

// 导出拖拽相关的方法
const { handleDragstart, handleDragend, handleDrop, handleDragover, dragState } = useDrag(emit, 'change-mark-index');
// 导出有关Dialog的属性，方法
const { dialogState, dialogFormState, showAddMarkDialog, closeAddMarkDialog, autoGetInfo } = useDialog();

const state = reactive<MarkState>({
  // 标志当前是何种操作
  handleType: 'add',
  // 默认图标
  defaultImg: ``,
  // 用来标记当前鼠标划过的书签
  currentMark: -1,
});

// 操作书签
const handleMark = (type: HandleMarkType) => {
  const result = form.value.submitForm();
  if (result) {
    if (type === 'add') {
      emit('add-mark', dialogState);
    }
    if (type === 'update') {
      emit('update-mark', state.currentMark, dialogState);
    }
    closeAddMarkDialog();
  }
};

const handChange = () => {
  console.log(dialogState.targetUrl);
};

// 添加书签
const addMark = () => {
  state.handleType = 'add';
  showAddMarkDialog();
};
// 删除书签
const deleteMark = (index: number) => {
  emit('delete-mark', index);
};
// 修改书签
const updateMark = (item: MarkProps, index: number) => {
  state.handleType = 'update';
  // 暂时先这么做 以后有更好的方法替换一下  因为弹窗出来的时候会触发一次mouseleave事件把currentmark改为-1
  setTimeout(() => {
    state.currentMark = index;
  }, 500);
  showAddMarkDialog(item);
};

// 当前鼠标划过的书签
const changeMark = (currentId: number) => {
  state.currentMark = currentId;
};

// 打开目标网站
const inter = (targetUrl: string) => {
  if (!props.editMode) {
    window.open(targetUrl);
  } else {
    createMessage('请先退出编辑模式 !');
  }
};
</script>

<style lang="scss" scoped>
.mark-list-box {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  position: relative;

  .mark-item {
    min-height: 102px;
    cursor: pointer;
    width: 400px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: var(--glassmorphism-filter);
    border-radius: var(--glassmorphism-radius);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 18px 0 rgba(31, 38, 135, 0.2);
    padding: 10px;
    margin: 7px 20px 7px 20px;
    position: relative;

    &:hover {
      background: var(--color-mark-title-hover);
    }
    .item-icon {
      width: 80px;
      max-height: 80px;
    }
    .item-info {
      padding: 0 20px;
      font-size: 14px;

      .item-title {
        font-weight: 700;
        margin: 0 0 10px 0;
        @extend .item-explain;
        color: var(--color-mark-title);
        font-size: 18px;
      }
      .item-explain {
        width: 255px;
        overflow: hidden;
        xite-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .edit-icon {
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);

      i {
        font-size: 14px;
        margin: 10px 10px 7px 10px;
      }
    }
  }
  .mark-item-add {
    @extend .mark-item;
    height: 100px;
    justify-content: center;
  }

  .no-marks {
    position: absolute;
    left: 50%;
    top: 200px;
    transform: translate(-50%);
    font-size: 14px;
    color: var(--theme-main);
  }

  .isDragging {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      background-color: #4646cc;
      top: -1px;
      left: 0px;
      border-radius: 2px;
      box-shadow: 0px 5px 26px 2px blue;
    }
  }
}

.add-mark-dialog {
  .footer {
    display: flex;
    justify-content: space-between;

    .auto-get-info {
      display: flex;
      justify-content: flex-start;

      .auto-btn {
        margin: 0 20px 20px 30px;
      }

      .loading {
        height: 20px;
        position: relative;
        top: 5px;
      }
    }
    .preview-icon {
      width: 80px;
      height: 80px;
      margin-right: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      background: var(--glassmorphism-rgba);
      backdrop-filter: var(--glassmorphism-filter);
      border-radius: var(--glassmorphism-radius);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);

      img {
        width: 80px;
        height: 80px;
      }

      .preview-text {
        font-size: 15px;
      }
    }
  }
}
</style>
