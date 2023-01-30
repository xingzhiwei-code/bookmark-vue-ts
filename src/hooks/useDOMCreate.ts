// 在body中插入一个自定义的div

import { onUnmounted } from 'vue';

const useDOMCreate = (nodeId: string): HTMLDivElement => {
  // 创建一个div节点
  const node = document.createElement('div');
  // 赋值class类名
  node.className = nodeId;
  // console.log(node, document.body);

  // 在body中插入div节点
  document.body.appendChild(node);
  // 在组件卸载的时候移除dom节点
  onUnmounted(() => {
    document.body.removeChild(node);
  });
  return node;
};

export default useDOMCreate;
