<!-- input输入框组件 -->

<template>
  <div class="x-input-box" :style="{ width: width, padding: padding }">
    <input class="x-input" v-model="value" @change="validateInput" v-bind="$attrs" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs, onMounted } from 'vue';
import createMessage from '../Message';
import { RulesProp, handlerValidateInput } from './index';
import { emitter } from '../../hooks/useMitt';

export default defineComponent({
  name: 'x-input',
  inheritAttrs: false, // 根元素不继承$attrs
  props: {
    rules: {
      type: Array as PropType<RulesProp>,
    },
    modelValue: String,
    width: {
      type: String,
      default: '100%',
    },
    padding: {
      type: String,
      default: '30px',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // 定一个数据类型 包括值、是否错误、错误信息
    const inputRef = reactive({
      // 计算属性
      value: computed({
        get: () => props.modelValue || '',
        set: (val) => {
          emit('update:modelValue', val);
        },
      }),
      error: false,
      message: '',
    });

    // 验证函数
    const validateInput = () => {
      // 循环rules数组，返回结果
      const isAllPass = props.rules?.every((rule) => {
        // 赋值错误信息
        inputRef.message = rule.message;
        // 执行验证函数
        return handlerValidateInput(inputRef.value, rule);
      });
      // 如果没有通过验证，触发error错误开关
      inputRef.error = !isAllPass;
      if (!isAllPass) {
        createMessage({ type: 'error', message: inputRef.message });
      }
      return isAllPass;
    };
    // 初始化时执行form-item-created,向form组件添加验证函数
    onMounted(() => {
      emitter.emit('form-item-created', validateInput);
    });

    return {
      ...toRefs(inputRef),
      validateInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.x-input-box {
  font-size: 1px;
  .x-input {
    color: var(--color-text);
    width: calc(100% - 40px);
    height: 30px;
    padding: 0 20px;
    outline: none;
    background: var(--glassmorphism-rgba);
    backdrop-filter: blur(15px);
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  }
  .wh-input::-webkit-input-placeholder {
    color: var(--color-text-placeholder);
  }
}
</style>
