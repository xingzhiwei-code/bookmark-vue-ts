// 文件上传和下载方法

import createMessage from '@/baseComponents/Message';

// 文件下载
export const downloadFile = (jsonStr: any) => {
  // 将数据转换成字符串
  jsonStr = JSON.stringify(jsonStr);
  // 创建 blob（流）对象
  const blob = new Blob([jsonStr]);
  // 创建一个 a 标签
  const el = document.createElement('a');
  // 创建一个 URL 对象并传给 a 标签的href属性（URL.createObjectURL该方法接收一个blob对象，并为其创建一个唯一的URL）
  el.href = URL.createObjectURL(blob);
  console.log(el.href);
  // 设置文件下载默认名
  el.download = '系统菜单数据.json';
  // 触发下载事件
  el.click();
};

// 文件上传
export const uploadFile = (e: any) => {
  return new Promise((resolve) => {
    // 如果没有选择文件，什么都不做
    if (e.target.value === '' || e.target.value.length < 1) {
      return;
    }
    // 如果不是本网站所需要的json格式的文件，给出提示
    if (e.target.file[0].type !== 'application/json') {
      createMessage('请上传由本站导出的json格式的文件 !');
      return;
    }
    // 创建 FileReader 对象（读取文件）
    const reader = new FileReader();
    // 把文件读取为字符串
    reader.readAsText(e.target.file[0]);
    // 文件读取完成
    reader.onload = (ev: any) => {
      resolve(ev);
    };
  });
};
