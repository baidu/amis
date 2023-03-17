import {renderersMap, Renderer} from '../factory';
import {OptionsControl} from './Options';
import FormItem from './Item';

declare const window: Window & {
  AmisCustomRenderers: {
    [props: string]: any;
  };
};

/**
 * 提供两种特殊的注册渲染器的方式
 * 1、自动加载预先注册的自定义渲染器：自动加载并注册 window.AmisCustomRenderers 中的渲染器
 * 2、通过 postMessage 告知 amis 注册一个新的渲染器：间接注册渲染器，无需直接依赖 amis。
 */

// 自动加载预先注册的自定义渲染器
export function autoPreRegisterAmisCustomRenderers() {
  if (window.AmisCustomRenderers) {
    Object.keys(window.AmisCustomRenderers).forEach(rendererType => {
      if (renderersMap[rendererType]) {
        console.warn(`[amis-core]：预注册渲染器失败，当前已存在重名渲染器（${rendererType}）。`);
      } else {
        const curAmisRenderer = window.AmisCustomRenderers[rendererType];
        if (curAmisRenderer) {
          registerAmisRendererByUsage(rendererType, curAmisRenderer);
        }
      }
    })
  }
}

// 自动加载并注册 window.AmisCustomRenderers 中的渲染器
autoPreRegisterAmisCustomRenderers();

// postMessage 渲染器动态注册机制
window.addEventListener(
  'message',
  (event: any) => {
    if (!event.data) {
      return;
    }
    if (
      event.data?.type === 'amis-renderer-register-event' &&
      event.data?.amisRenderer &&
      event.data.amisRenderer.type
    ) {
      const curAmisRenderer = event.data?.amisRenderer;
      const curUsage = curAmisRenderer?.usage || 'renderer';
      if (renderersMap[curAmisRenderer.type]) {
        console.warn(`[amis-core]：动态注册渲染器失败，当前已存在重名渲染器（${curAmisRenderer.type}）。`);
      } else {
        console.info(
          '[amis-core]响应动态注册渲染器事件：',
          curAmisRenderer.type
        );
        registerAmisRendererByUsage(curUsage, curAmisRenderer);
      }
    }
  },
  false
);

// 根据类型（usage）进行注册 amis渲染器
function registerAmisRendererByUsage(curUsage: string, curAmisRenderer: any) {
  // 当前支持注册的渲染器类型
  const registerMap: {
    [props: string]: Function
  } = {
    renderer: Renderer,
    formitem: FormItem,
    options: OptionsControl,
  };
  let curAmisRendererComponent = curAmisRenderer.component;
  if (
    !curAmisRendererComponent &&
    window.AmisCustomRenderers &&
    window.AmisCustomRenderers[curAmisRenderer.type] &&
    window.AmisCustomRenderers[curAmisRenderer.type].component
  ) {
    curAmisRendererComponent = window.AmisCustomRenderers[curAmisRenderer.type].component;
  }
  if (
    curAmisRendererComponent &&
    ['renderer', 'formitem', 'options'].includes(curUsage) &&
    registerMap[curUsage]
  ) {
    registerMap[curUsage as keyof typeof registerMap]({
      ...(curAmisRenderer.config || {}),
      type: curAmisRenderer.type,
      weight: curAmisRenderer.weight || 0,
      autoVar: curAmisRenderer.autoVar || false
    })(curAmisRendererComponent);
  }
}
