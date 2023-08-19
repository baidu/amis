// 基本上都是从 sortable 那抄的，让拖拽切换有个动画，看起来更流畅。
// 用法是移动前先 animat.capture(container) 把移动前的位置信息记住
// 然后移动节点
// 然后 animate.animateAll(); 计算移动后的位置，然后马上通过 css transform 到原来的位置
// 然后开始动画到移动后的位置。

interface Rect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

interface AnimationEleProps {
  toRect?: Rect | null;
  fromRect?: Rect | null;
  prevToRect?: Rect | null;
  prevFromRect?: Rect | null;
  animationTime?: number;
  thisAnimationDuration?: number;
  animationResetTimer?: NodeJS.Timeout;
}

type AnimationEle = HTMLElement & AnimationEleProps;

interface AnimationState {
  rect: Rect;
  target: AnimationEle;
}

function userAgent(pattern: RegExp): any {
  if (typeof window !== 'undefined' && window.navigator) {
    return !!(/*@__PURE__*/ navigator.userAgent.match(pattern));
  }
}

const IE11OrLess = userAgent(
  /(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i
);
// const Edge = userAgent(/Edge/i);
// const FireFox = userAgent(/firefox/i);
// const Safari =
//   userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
// const IOS = userAgent(/iP(ad|od|hone)/i);
// const ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

const AnimationDuration = 150;
const AnimationEasing = 'cubic-bezier(1, 0, 0, 1)';

const toUpperCamelCase = (s: string) => {
  return [s[0].toUpperCase(), ...s.slice(1)].join('');
};

function css(
  el: HTMLElement & {currentStyle?: CSSStyleDeclaration},
  prop: keyof CSSStyleDeclaration,
  val?: string | number
) {
  if (val == null) {
    return (document.defaultView?.getComputedStyle(el, '') ??
      el.currentStyle)?.[prop];
  }

  const style = el.style;

  if (
    !(prop in style) &&
    typeof prop === 'string' &&
    prop.indexOf('webkit') === -1
  ) {
    prop = ('webkit' + toUpperCamelCase(prop)) as keyof CSSStyleDeclaration;
  }

  (style[prop] as string) = val + (typeof val === 'number' ? 'px' : '');
  return null;
}

function matrix(el: HTMLElement) {
  const transform = css(el, 'transform');
  let appliedTransforms = '';

  if (transform && transform !== 'none') {
    appliedTransforms = transform + ' ' + appliedTransforms;
  }

  const matrixFn =
    window.DOMMatrix ||
    window.WebKitCSSMatrix ||
    (window as any).CSSMatrix ||
    (window as any).MSCSSMatrix;

  /*jshint -W056 */
  return matrixFn && new matrixFn(appliedTransforms);
}

function isRectEqual(rect1: Rect, rect2: Rect) {
  return (
    Math.round(rect1.top) === Math.round(rect2.top) &&
    Math.round(rect1.left) === Math.round(rect2.left) &&
    Math.round(rect1.height) === Math.round(rect2.height) &&
    Math.round(rect1.width) === Math.round(rect2.width)
  );
}

function calculateRealTime(animatingRect: Rect, fromRect: Rect, toRect: Rect) {
  return (
    (Math.sqrt(
      Math.pow(fromRect.top - animatingRect.top, 2) +
        Math.pow(fromRect.left - animatingRect.left, 2)
    ) /
      Math.sqrt(
        Math.pow(fromRect.top - toRect.top, 2) +
          Math.pow(fromRect.left - toRect.left, 2)
      )) *
    AnimationDuration
  );
}

function getWindowScrollingElement() {
  return document.scrollingElement || document.documentElement;
}

function getRect(
  // 暂定
  el: HTMLElement | Window,
  relativeToContainingBlock?: boolean,
  relativeToNonStaticParent?: boolean,
  undoScale?: boolean,
  container?: HTMLElement
) {
  if (el === window) {
    return {
      top: 0,
      left: 0,
      bottom: window.innerHeight,
      right: window.innerWidth,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  el = el as HTMLElement;

  if (!el.getBoundingClientRect) {
    return;
  }

  let elRect: DOMRect | null = null;
  let top, left, bottom, right, height, width;

  if (el !== getWindowScrollingElement()) {
    elRect = el.getBoundingClientRect();
    top = elRect.top;
    left = elRect.left;
    bottom = elRect.bottom;
    right = elRect.right;
    height = elRect.height;
    width = elRect.width;
  } else {
    top = 0;
    left = 0;
    bottom = window.innerHeight;
    right = window.innerWidth;
    height = window.innerHeight;
    width = window.innerWidth;
  }

  if (relativeToContainingBlock || relativeToNonStaticParent) {
    // Adjust for translate()
    container = container || (el.parentNode as HTMLElement);

    // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
    // Not needed on <= IE11
    if (!IE11OrLess) {
      do {
        if (
          container &&
          container.getBoundingClientRect &&
          (css(container, 'transform') !== 'none' ||
            (relativeToNonStaticParent &&
              css(container, 'position') !== 'static'))
        ) {
          const containerRect = container.getBoundingClientRect();

          // Set relative to edges of padding box of container
          top -=
            containerRect.top +
            parseInt(css(container, 'borderTopWidth') as string);
          left -=
            containerRect.left +
            parseInt(css(container, 'borderLeftWidth') as string);
          bottom = top + (elRect?.height ?? 0);
          right = left + (elRect?.width ?? 0);

          break;
        }
        /* jshint boss:true */
      } while ((container = container.parentNode as HTMLElement));
    }
  }

  if (undoScale) {
    // Adjust for scale()
    const elMatrix = matrix(container || el);
    if (elMatrix) {
      const scaleX = elMatrix.a;
      const scaleY = elMatrix.d;

      top /= scaleY;
      left /= scaleX;

      width /= scaleX;
      height /= scaleY;

      bottom = top + height;
      right = left + width;
    }
  }

  return {
    top,
    left,
    bottom,
    right,
    width,
    height
  };
}

export class AnimationManager {
  animating: boolean = false;
  animationCallbackId: NodeJS.Timeout;
  states: Array<AnimationState> = [];

  capture(el: HTMLElement) {
    // 重置
    this.states = ([...el.children] as Array<AnimationEle>)
      // 过滤 ghost 和隐藏节点
      .filter(
        child => child.classList.contains('is-ghost') || !getRect(child)?.width
      )
      .map<AnimationState>(target => {
        const rect = getRect(target)!;
        const fromRect = {...rect};
        // 还在动画中
        if (target.thisAnimationDuration) {
          const childMatrix = matrix(target);

          if (childMatrix) {
            fromRect.top -= childMatrix.f;
            fromRect.left -= childMatrix.e;
          }
        }

        target.fromRect = fromRect;

        return {
          rect,
          target
        };
      });
  }

  animateAll(callback?: () => void) {
    this.animating = false;
    let animationTime = 0;

    this.states.forEach(({target, rect: animatingRect}) => {
      const toRect = {
        ...getRect(target)!
      };
      const fromRect = target.fromRect;
      const prevFromRect = target.prevFromRect;
      const prevToRect = target.prevToRect;
      const targetMatrix = matrix(target);

      let time = 0;

      if (targetMatrix) {
        // Compensate for current animation
        toRect.top -= targetMatrix.f;
        toRect.left -= targetMatrix.e;
      }

      target.toRect = toRect;

      if (target.thisAnimationDuration) {
        // Could also check if animatingRect is between fromRect and toRect
        if (
          prevFromRect &&
          fromRect &&
          prevToRect &&
          isRectEqual(prevFromRect, toRect) &&
          !isRectEqual(fromRect, toRect) &&
          // Make sure animatingRect is on line between toRect & fromRect
          (animatingRect.top - toRect.top) /
            (animatingRect.left - toRect.left) ===
            (fromRect.top - toRect.top) / (fromRect.left - toRect.left)
        ) {
          // If returning to same place as started from animation and on same axis
          time = calculateRealTime(animatingRect, prevFromRect, prevToRect);
        }
      }

      // if fromRect != toRect: animate
      if (fromRect && !isRectEqual(toRect, fromRect)) {
        target.prevFromRect = fromRect;
        target.prevToRect = toRect;

        if (!time) {
          time = AnimationDuration;
        }
        this.animate(target, animatingRect, toRect, time);
      }

      if (time) {
        this.animating = true;
        animationTime = Math.max(animationTime, time);
        clearTimeout(target.animationResetTimer);
        target.animationResetTimer = setTimeout(() => {
          target.animationTime = 0;
          target.prevFromRect = null;
          target.fromRect = null;
          target.prevToRect = null;
          target.thisAnimationDuration = 0;
        }, time);
        target.thisAnimationDuration = time;
      }
    });

    clearTimeout(this.animationCallbackId);
    if (!this.animating) {
      typeof callback === 'function' && callback();
    } else {
      this.animationCallbackId = setTimeout(() => {
        this.animating = false;
        typeof callback === 'function' && callback();
      }, animationTime);
    }
    this.states = [];
  }

  animate(
    target: AnimationEle & {
      animated?: NodeJS.Timeout;
      animatingX?: boolean;
      animatingY?: boolean;
    },
    currentRect: Rect,
    toRect: Rect,
    duration: number
  ) {
    if (duration) {
      css(target, 'transition', '');
      css(target, 'transform', '');
      const translateX = currentRect.left - toRect.left;
      const translateY = currentRect.top - toRect.top;

      target.animatingX = !!translateX;
      target.animatingY = !!translateY;

      css(
        target,
        'transform',
        'translate3d(' + translateX + 'px,' + translateY + 'px,0)'
      );

      let affectDisplay = false;

      if (css(target, 'display') === 'inline') {
        affectDisplay = true;
        css(target, 'display', 'inline-block');
      }

      target.offsetWidth; // repaint

      css(
        target,
        'transition',
        'transform ' +
          duration +
          'ms' +
          (AnimationEasing ? ' ' + AnimationEasing : '')
      );
      css(target, 'transform', 'translate3d(0,0,0)');
      clearTimeout(target.animated);
      target.animated = setTimeout(() => {
        css(target, 'transition', '');
        css(target, 'transform', '');
        affectDisplay && css(target, 'display', '');

        target.animated = undefined;
        target.animatingX = false;
        target.animatingY = false;
      }, duration);
    }
  }
}

export default new AnimationManager();
