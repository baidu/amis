import styleManager from '../StyleManager';

export interface AnimationsProps {
  enter?: {
    type: string;
    duration?: number;
    delay?: number;
    repeat?: boolean;
    inView?: boolean;
  };
  attention?: {
    type: string;
    duration?: number;
    repeat?: string;
    delay?: number;
  };
  hover?: {
    type: string;
    duration?: number;
    delay?: number;
    repeat?: string;
  };
  exit?: {
    type: string;
    duration?: number;
    delay?: number;
    repeat?: boolean;
    outView?: boolean;
  };
}

function generateStyleByAnimation(
  className: string[],
  animation: {
    name: string;
    duration?: number;
    iterationCount?: string | number;
    delay?: number;
    fillMode?: string;
    timingFunction?: string;
  }
) {
  return {
    [className.join(',')]: {
      animationName: animation.name,
      animationDuration: `${animation.duration || 1}s`,
      animationIterationCount: animation.iterationCount || 1,
      animationDelay: `${animation.delay || 0}s`,
      animationTimingFunction: animation.timingFunction || 'ease',
      animationFillMode: animation.fillMode || 'none'
    }
  };
}

function generateStyleByHover(
  className: string,
  animation: {
    name: string;
    duration?: number;
    delay?: number;
    repeat?: string;
  }
) {
  let style = {};
  if (['hoverFlash', 'hoverShake'].includes(animation.name)) {
    style = {
      [`${className}:hover,${className}-show`]: {
        animation: `${animation.name} ${animation.duration || 1}s ease ${
          animation.delay || 0
        }s ${animation.repeat || 1}`
      }
    };
  }
  return {
    [className]: {
      transition: `all ${animation.duration || 1}s ease ${
        animation.delay || 0
      }s`
    },
    ...style
  };
}

export function createAnimationStyle(
  id: string,
  animationsConfig: AnimationsProps
) {
  let styleConfig = {};
  Object.keys(animationsConfig).forEach((key: keyof AnimationsProps) => {
    const animationConfig = animationsConfig[key];
    if (!animationConfig) {
      return;
    }
    styleConfig = Object.assign(
      styleConfig,
      key === 'hover'
        ? generateStyleByHover(`.${animationConfig.type}-${id}-${key}`, {
            name: animationConfig.type,
            duration: animationConfig.duration,
            delay: animationConfig.delay,
            repeat: animationConfig.repeat as string
          })
        : generateStyleByAnimation([`.${animationConfig.type}-${id}-${key}`], {
            name: animationConfig.type,
            duration: animationConfig.duration,
            iterationCount: key === 'attention' ? 'infinite' : 1,
            delay: animationConfig.delay,
            fillMode: key === 'attention' ? 'none' : 'forwards'
          })
    );
  });

  styleManager.updateStyle({
    [id]: styleConfig
  });
}
