// 标签组件中与Dialog的相关操作

import { RulesProp } from '@/baseComponents/Input/index';
import { DialogState } from 'coms/LabelList/index';
import { reactive } from 'vue';

// 标签验证规则
const rules: RulesProp = [
  {
    type: 'maxlength',
    message: '标签名称最多10个字符 !',
    maxlength: 10,
  },
  {
    type: 'required',
    message: '请输入标签名称 !',
  },
];

const useDialog = () => {
  const dialogState = reactive<DialogState>({
    // 是否显示添加标签弹框
    isShowLabelDialog: false,
    // 输入框绑定值（标签名称）
    labelTitle: '',
    // 标题验证规则
    rules: rules,
  });

  // 打开添加标签弹框
  const showLabelDialog = (value?: string) => {
    dialogState.isShowLabelDialog = true;
    // 如果之前有数据（编辑），则回填数据
    if (value) {
      dialogState.labelTitle = value;
    }
  };

  // 关闭标签弹框
  const closeLabelDialog = () => {
    dialogState.isShowLabelDialog = false;
    dialogState.labelTitle = '';
  };

  return {
    dialogState,
    showLabelDialog,
    closeLabelDialog,
  };
};

export default useDialog;
