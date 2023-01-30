// message组件 （外部处理文件）
import Message from './Message.vue';
import { createVNode, reactive, VNode, computed, render } from 'vue';

// message类型
export type MessageType = 'success' | 'error' | 'default';

// 一条消息数据的接口
export interface MessageOptions {
  id?: string;
  type?: MessageType;
  message?: string;
  duration?: number;
  offsetNumber?: number;
}

export type MessageParams = MessageOptions | string;

export type MessageList = MessageOptions[];

// 存放所有的message实例  用来计算偏移量
const instances = reactive<VNode[]>([]);
const offsetNumber = computed(() => instances.length + 1);

// 创建一个消息组件
const createMessage = (options: MessageParams) => {
  // 如果接收的参数是string，就把它转换成options对象格式
  if (typeof options === 'string') {
    options = {
      message: options,
    };
  }
  // 把整体组件创建成一个虚拟节点的形式，也就是一个组件实例
  const vnode = createVNode(Message, {
    ...options,
    offsetNumber: offsetNumber.value,
  });
  // console.log('测试成功', vnode);

  // 创建一个容器
  const container = document.createElement('div');

  // 把创建的实例渲染到容器里
  render(vnode, container);
  // 将渲染结果插入到body里面
  // 为什么上面要多创建一个div，而不是直接插入到body中(所以要插入的是div下面的第一个字元素)
  // 因为方便销毁组件，放在body中销毁时不好处理
  document.body.appendChild(container.firstElementChild!);

  instances.push(vnode);

  // !.解释一下（非空断言操作符）指后面的值肯定不是null和undefined
  // 给实例添加一个销毁的方法
  vnode.props!.onDestroy = () => {
    instances.shift();
    instances.forEach((item: any) => {
      item.component.props.offsetNumber -= 1;
    });
    // 移除dom
    render(null, container);
  };
};

export default createMessage;
