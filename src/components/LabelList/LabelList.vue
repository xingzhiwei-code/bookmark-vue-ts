<!-- 标签列表组件 -->

<template>
  <div class="label-list-box">
    <!-- 循环生成标签列表 -->
    <div
      :draggable="editMode"
      @dragend="dragendFn()"
      @dragstart="handleDragstart(index)"
      @drop.prevent="handleDrop()"
      @dragover.prevent="handleDragover(index)"
      class="label"
      v-for="(item, index) in labelList"
      :key="index"
      @click.prevent="changeLabel(index, 'click')"
      @mouseenter="changeLabel(index, 'hover')"
      @mouseleave="changeLabel(-1, 'hover')"
      :class="{
        currentClick: currentId === index,
        currentHover: currentHoverLabel === index,
        isDragging: index === newItemIndex,
      }"
    >
      <!-- 标签标题 -->
      <i class="iconfont">&#xe610;</i>
      <div :title="item.title" class="label-title">
        {{ item.title }}
      </div>
      <div class="edit-icon" v-if="currentHoverLabel === index && editMode">
        <i class="iconfont" @click.stop="updateLabel(item.title, index)">&#xe623;</i>
        <i class="iconfont" @click.stop="deleteLabel(index)">&#xe60f;</i>
      </div>
    </div>
  </div>

  <!-- 添加单个标签的弹框 -->
  <Dialog
    :dialog-visible="isShowLabelDialog"
    @cancle="closeLabelDialog"
    @confirm="handleLabel(handleType)"
    :title="dialogTitle"
  >
    <x-form ref="form">
      <X-input
        :rules="rules"
        type="text"
        v-model="labelTitle"
        placeholder="请输入标签名称"
        padding="50px 30px"
        maxlength="10"
      >
      </X-input>
    </x-form>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs, ref, onUnmounted } from 'vue';
import { LabelListProps, HandleLableType, LabelState } from '.';

import XInput from '@/baseComponents/Input/X-input.vue';
import XForm from '@/baseComponents/Form/X-form.vue';
import Dialog from '@/baseComponents/Dialog/Dialog.vue';
import useDialog from './useDialog';
import useDrag from '@/hooks/useDraggable';
import { emitter } from '@/hooks/useMitt';
export default defineComponent({
  name: 'LabelList',
  props: {
    labelList: {
      type: Array as PropType<LabelListProps>,
      required: true,
      default: () => [],
    },
    // 当前模式（编辑状态、展示状态）
    editMode: {
      type: Boolean,
      default: false,
    },
    // 当前标签ID
    currentId: {
      type: Number,
      default: 0,
    },
  },
  components: {
    XForm,
    XInput,
    Dialog,
  },
  emits: ['change-label', 'add-label', 'delete-label', 'update-label', 'change-label-index'],
  setup(props, { emit }) {
    // 获取form元素
    const form = ref<any>(null);

    // 导出有关Dialog的属性，方法
    const { dialogState, showLabelDialog, closeLabelDialog } = useDialog();
    // 导出拖拽有关方法
    const { handleDragstart, handleDrop, handleDragover, handleDragend, dragState } = useDrag(
      emit,
      'change-label-index'
    );

    const state = reactive<LabelState>({
      // 当前是何种操作
      handleType: 'add',
      // 高亮当前点击的标签
      currentClickLabel: 0,
      // 高亮鼠标滑过的标签
      currentHoverLabel: -1,
      dialogTitle: computed(() => {
        if (state.handleType === 'add') {
          return '添加标签';
        } else {
          return '编辑标签';
        }
      }),
    });

    // 切换标签
    const changeLabel = (currentId: number, type: string) => {
      if (type === 'click') {
        state.currentClickLabel = currentId;
        emit('change-label', currentId);
      }
      if (type === 'hover') {
        state.currentHoverLabel = currentId;
      }
    };

    // 操作标签
    const handleLabel = (type: HandleLableType) => {
      const result = form.value.submitForm();
      if (result) {
        if (type === 'add') {
          emit('add-label', dialogState.labelTitle);
          // 添加完成后，修改当前标签的长度，最后一项为新增的项
          changeLabel(props.labelList.length - 1, 'click');
        }
        if (type === 'update') {
          emit('update-label', state.currentClickLabel, dialogState.labelTitle);
        }
      }
      closeLabelDialog();
    };

    // 添加标签
    const addLabel = () => {
      state.handleType = 'add';
      showLabelDialog();
    };
    // 修改标签
    const updateLabel = (value: string, index: number) => {
      state.handleType = 'update';
      state.currentClickLabel = index;
      showLabelDialog(value);
    };
    // 删除标签
    const deleteLabel = (index: number) => {
      state.currentClickLabel = index;
      emit('delete-label', state.currentClickLabel);
      emit('change-label', 0);
      changeLabel(0, 'click');
    };

    // 监听事件，打开添加标签弹框
    emitter.on('add-label', addLabel);
    // 显示卸载
    onUnmounted(() => {
      emitter.off('add-label', addLabel);
    });

    // 停止拖拽时触发
    const dragendFn = () => {
      changeLabel(dragState.newItemIndex, 'click');
      handleDragend();
    };

    return {
      ...toRefs(state),
      ...toRefs(dialogState),
      ...toRefs(dragState),
      showLabelDialog,
      closeLabelDialog,
      handleDragstart,
      handleDrop,
      handleDragover,
      handleDragend,
      // 内部方法
      changeLabel,
      dragendFn,
      handleLabel,
      updateLabel,
      deleteLabel,
    };
  },
});
</script>

<style lang="scss" scoped>
.label-list-box {
  height: 100%;

  .currentHover {
    background: var(--color-label-title-hover);
    backdrop-filter: var(--glassmorphism-filter);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
    color: var(--color-label-color-hover);
  }
  .currentClick {
    background: var(--color-label-title-click);
    backdrop-filter: var(--glassmorphism-filter);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  }

  .label {
    font-size: 14px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    color: var(--color-label-title);
    border: none;
    position: relative;
    padding: 10px 5px;

    .label-title {
      padding-left: 10px;
      width: 120px;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .edit-icon {
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);

      i {
        font-size: 12px;
        margin: 4px 8px 2px 0px;
      }
    }
  }

  .isDragging {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 3px;
      background-color: #8307ea;
      top: -1px;
      left: 0px;
      border-radius: 2px;
      box-shadow: 0px 5px 26px 2px #4646cc;
    }
  }
}
</style>
