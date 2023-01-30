// 收藏夹组件中跟书签相关的操作

import { ComputedRef } from 'vue';
import { MarkProps } from '../MarkList';
import createMessage from '@/baseComponents/Message';

const useMarks = (markList: ComputedRef<MarkProps[]>) => {
  const marks = markList;
  // 添加书签
  const addMark = (state: MarkProps) => {
    marks.value.push({
      icon: state.icon,
      title: state.title,
      targetUrl: state.targetUrl,
      explain: state.explain,
    });
    createMessage({ type: 'success', message: '添加书签成功 !' });
  };
  // 删除书签
  const deleteMark = (index: number) => {
    marks.value.splice(index, 1);
    createMessage({ type: 'success', message: '删除书签成功 !' });
  };
  // 修改书签
  const updateMark = (index: number, state: MarkProps) => {
    marks.value[index] = { ...state };
    createMessage({ type: 'success', message: '修改书签成功 !' });
  };
  // 修改书签索引
  const changeMarkIndex = (oldItemIndex: number, newItemIndex: number) => {
    // 删除旧的数据
    const changeItem = marks.value.splice(oldItemIndex, 1)[0];
    // splice返回值为删除的项，把返回值放到新的位置
    marks.value.splice(newItemIndex, 0, changeItem);
  };

  return {
    addMark,
    deleteMark,
    updateMark,
    changeMarkIndex,
  };
};

export default useMarks;
