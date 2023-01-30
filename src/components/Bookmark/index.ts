// 收藏夹组件一些基础配置、数据、接口等

import data from './data';
import { LabelListProps } from 'coms/LabelList/index';

// 初始数据
export const initData: LabelListProps = data;

// 数据类型
export interface BookmarkState {
  warbleData: LabelListProps;
  editMode: boolean;
  motto: string;
}

const mottoList = [
  '凡所有相，皆为虚妄。若见诸相非相，即见如来',
  '不取于相，如如不动',
  '万法皆空，因果不空',
  '悲凉才是人生常态，快乐才是意外',
  '事物的发展总是成螺旋式上升和波浪式前进的',
];

export const getMotto = () => {
  const random = Math.floor(Math.random() * mottoList.length);
  return mottoList[random];
};
