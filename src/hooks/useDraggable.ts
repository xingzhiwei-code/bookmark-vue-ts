import { reactive } from 'vue';

export interface DragState {
  oldItemIndex: number;
  newItemIndex: number;
}

const useDrag = (emit: any, emitName: string) => {
  const dragState = reactive<DragState>({
    // 当前正在拖拽的元素
    oldItemIndex: -1,
    // 将要移到的位置
    newItemIndex: -1,
  });

  // 开始拖拽时触发
  const handleDragstart = (index: number) => {
    dragState.oldItemIndex = index;
  };
  // 拖拽经过其他元素时触发
  const handleDragover = (index: number) => {
    console.log('经过了其他元素');

    dragState.newItemIndex = index;
  };
  // 在目标位置松开时触发
  const handleDrop = () => {
    console.log('拖拽中');
    // 如果位置没有发生改变 什么也不做
    if (dragState.newItemIndex === dragState.oldItemIndex) {
      console.log('位置没有改变');
      return;
    }
    // 位置发生改变
    emit(emitName, dragState.oldItemIndex, dragState.newItemIndex);
  };
  // 拖拽结束时触发
  const handleDragend = () => {
    dragState.newItemIndex = -1;
    dragState.oldItemIndex = -1;
  };

  return {
    dragState,
    handleDragstart,
    handleDragover,
    handleDrop,
    handleDragend,
  };
};

export default useDrag;
