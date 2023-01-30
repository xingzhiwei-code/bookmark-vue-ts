<!-- 弹窗组件 -->

<template>
  <!-- 遮罩层 -->
  <Overlay v-if="dialogVisible" :show="dialogVisible" :close-on-click-modal="true" @close="onCancle" />
  <!-- 传送门 此处Dom节点会被插到.Dialog里 -->
  <teleport to=".Dialog">
    <div class="dialog-box" v-bind="$attrs">
      <transition name="dialog">
        <div class="dialog-content" v-if="dialogVisible" :style="`width:${width};margin-top:${top}`">
          <!-- Dialog组件header部分 -->
          <div class="dialog-header">
            <h5 class="dialog-title">{{ title }}</h5>
          </div>

          <!-- Dialog组件内容插槽 -->
          <slot></slot>

          <!-- Dialog组件footer部分 -->
          <div class="dialog-footer">
            <x-button
              @click="onConfirm"
              class="footer-btn"
              title="确认"
              :use-animation="true"
              :background-color="`rgba(160, 21, 114, 0.3)`"
            ></x-button>
            <x-button
              @click="onCancle"
              class="footer-btn"
              :use-animation="true"
              title="取消"
              v-if="showCancleButton"
            ></x-button>
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Overlay from '../Overlay/Overlay.vue';
import XButton from '../Button/X-button.vue';
import useDOMCreate from '../../hooks/useDOMCreate';
export default defineComponent({
  components: {
    Overlay,
    XButton,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '提示',
    },
    width: {
      type: String,
      default: '400px',
    },
    top: {
      type: String,
      default: '15vh',
    },
    // 是否展示底部按钮
    showCancleButton: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['cancle', 'confirm'],
  setup(props, { emit }) {
    // 创建dom节点 .Dialog
    if (!document.querySelector('.Dialog')) {
      console.log('创建dom节点');

      useDOMCreate('Dialog');
    }
    const onCancle = () => {
      emit('cancle');
    };
    const onConfirm = () => {
      emit('confirm');
    };
    return {
      onCancle,
      onConfirm,
    };
  },
});
</script>

<style lang="scss">
.dialog-box {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2001;

  .dialog-content {
    width: 100%;
    background: var(--glassmorphism-rgba);
    backdrop-filter: var(--glassmorphism-filter);
    border-radius: var(--glassmorphism-radius);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);

    .dialog-header {
      .dialog-title {
        font-size: 20px;
        padding: 10px 0 0 10px;
      }
    }

    .dialog-body {
      width: 100%;
    }
    .dialog-footer {
      display: flex;
      justify-content: flex-end;

      .footer-btn {
        margin: 0 20px 20px 0;
      }
    }
  }
}
</style>
