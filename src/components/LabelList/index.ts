// 标签组件的一些基础配置，数据，接口

import { MarkListProps } from 'coms/MarkList/index';
import { ComputedRef } from 'vue';
import { RulesProp } from '@/baseComponents/Input/index';

// 单个标签 (标题和对应书签数组组成)
export interface LabelsProps {
  title: string;
  marks: MarkListProps;
}

// 标签列表
export type LabelListProps = LabelsProps[];

// 操作标签的类型
export type HandleLableType = 'add' | 'update';

// 标签相关操作数据
export interface LabelState {
  handleType: HandleLableType;
  currentClickLabel: number;
  currentHoverLabel: number;
  dialogTitle: ComputedRef; // ToDo 具体作用未知（computed的类型）
}

// 弹窗相关操作数据
export interface DialogState {
  isShowLabelDialog: boolean;
  labelTitle: string;
  rules: RulesProp;
}
