// 收藏夹中跟标签有关的操作

import { BookmarkState } from './index';

import createMessage from '@/baseComponents/Message';
const useLabels = (state: BookmarkState) => {
  // 添加标签
  const addLabel = (title: string) => {
    state.warbleData.push({
      title: title,
      marks: [],
    });
    createMessage({ type: 'success', message: '添加标签成功 !' });
  };
  // 删除标签
  const deleteLabel = (index: number) => {
    state.warbleData.splice(index, 1);
    createMessage({ type: 'success', message: '删除标签成功 !' });
  };
  // 修改标签
  const updateLabel = (index: number, title: string) => {
    state.warbleData[index].title = title;
    createMessage({ type: 'success', message: '修改标签成功 !' });
  };
  // 修改标签索引
  const changeLabelIndex = (oldItemIndex: number, newItemIndex: number) => {
    console.log(oldItemIndex, newItemIndex);
    // 删除老的
    const changeItem = state.warbleData.splice(oldItemIndex, 1)[0];
    // 在列表中的目标位置新增删除的那一项
    state.warbleData.splice(newItemIndex, 0, changeItem);
  };
  return {
    addLabel,
    deleteLabel,
    updateLabel,
    changeLabelIndex,
  };
};

export default useLabels;
