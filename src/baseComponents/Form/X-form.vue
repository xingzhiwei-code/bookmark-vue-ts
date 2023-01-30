<!-- form表单组件 -->

<template>
  <form class="valid-form-container">
    <slot></slot>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue';
import { ValidateFunc } from './index';
import { emitter } from '../../hooks/useMitt';

export default defineComponent({
  name: 'ValidateForm',
  setup() {
    // 声明一个空数组   用来存放所有的验证函数
    let funcArr: ValidateFunc[] = [];
    // 验证函数
    const submitForm = () => {
      // 运行所有的校验函数
      const result = funcArr.every((func) => func());
      return result;
    };
    // 把item的验证函数添加到数组中
    const addValidater = (func: ValidateFunc | undefined) => {
      funcArr.push(func as ValidateFunc);
    };

    // 监听form-item-created事件，当有item触发的时候把验证函数添加到数组中
    emitter.on('form-item-created', addValidater);
    // 组件卸载的时候移除监听事件，数组重置为空
    onUnmounted(() => {
      emitter.off('form-item-created', addValidater);
      funcArr = [];
    });
    return {
      submitForm,
    };
  },
});
</script>

<style lang="scss" scoped></style>
