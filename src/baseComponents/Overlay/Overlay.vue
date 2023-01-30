<!-- 遮罩层 -->

<template>
  <!-- 传送门 此处Dom节点会被插在body里 -->
  <teleport to="body">
    <!-- 过渡动画 -->
    <transition name="base">
      <!-- 遮罩层 -->
      <div class="overly" :style="`z-index: ${zIndex}`" v-if="show" @click="handleClick"></div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Overlay',
  props: {
    zIndex: {
      type: Number,
      default: 2000,
    },
    show: {
      type: Boolean,
      default: false,
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const handleClick = () => {
      if (props.closeOnClickModal) {
        emit('close');
      }
    };
    return {
      handleClick,
    };
  },
});
</script>

<style lang="scss">
.overly {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.35);
  // 模糊滤镜
  backdrop-filter: blur(10px);
}
</style>
