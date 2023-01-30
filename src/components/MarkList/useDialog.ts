// 书签列表跟Dialog相关的操作

import { reactive } from 'vue';
import { RulesProp } from '@/baseComponents/Input';
import { DialogFormState, DialogState, MarkProps } from '.';
import createMessage from '@/baseComponents/Message';
import axios from '@/utils/request';

// 弹窗书签验证规则
const targetUrlRules: RulesProp = [
  {
    type: 'required',
    message: '请输入目标网址 !',
  },
];
const titleRules: RulesProp = [
  {
    type: 'required',
    message: '请输入书签名称 !',
  },
];
const iconRules: RulesProp = [];

const useDialog = () => {
  const dialogState = reactive<DialogState>({
    title: '', // 弹窗书签名称
    icon: '', // 图标url地址
    targetUrl: '', // 目标网址
    explain: '', // 网址简介
  });
  const dialogFormState = reactive<DialogFormState>({
    // 弹窗书签验证规则
    targetUrlRules: targetUrlRules,
    titleRules: titleRules,
    iconRules: iconRules,
    // 是否显示书签弹窗
    isShowAddMarkDialog: false,
    // 控制loading显示隐藏的属性
    loading1: false,
    loading2: false,
  });

  // 打开添加书签弹窗
  const showAddMarkDialog = (item?: MarkProps) => {
    if (item) {
      dialogState.targetUrl = item.targetUrl;
      dialogState.title = item.title;
      dialogState.explain = item.explain || '';
      dialogState.icon = item.icon || '';
    }
    dialogFormState.isShowAddMarkDialog = true;
  };
  // 关闭书签弹窗
  const closeAddMarkDialog = () => {
    dialogFormState.isShowAddMarkDialog = false;
    resetForm();
  };
  // 重置表单
  const resetForm = () => {
    dialogState.targetUrl = '';
    dialogState.title = '';
    dialogState.explain = '';
    dialogState.icon = '';
  };

  // 自动获取图标和地址
  const autoGetInfo = (type: string) => {
    // 判断是否输入目标网址
    if (!dialogState.targetUrl) {
      createMessage({ type: 'error', message: '请输入目标网址 !' });
      return;
    }
    if (type === 'title') {
      dialogFormState.loading1 = true;
    }
    if (type === 'icon') {
      dialogFormState.loading2 = true;
    }
    axios
      .post('https://www.duwanyu.com/spider/getIconAndTitle', { targetUrl: dialogState.targetUrl })
      .then((res) => {
        if (type === 'title') {
          dialogState.title = res.data.title;
          dialogFormState.loading1 = false;
        }
        if (type === 'icon') {
          dialogState.icon = res.data.icon;
          dialogFormState.loading2 = false;
        }
        createMessage({ type: 'success', message: '自动获取成功 !' });
      })
      .catch(() => {
        createMessage({ type: 'error', message: '自动获取失败,请手动输入 !' });
      });
  };
  return {
    showAddMarkDialog,
    closeAddMarkDialog,
    autoGetInfo,
    dialogState,
    dialogFormState,
  };
};

export default useDialog;
