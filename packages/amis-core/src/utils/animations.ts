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
    iterationCount?: string;
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

export function createAnimationStyle(
  id: string,
  animationsConfig: AnimationsProps
) {
  const enterAnimationConfig = animationsConfig.enter;
  let enterStyle = {};
  if (enterAnimationConfig?.type) {
    enterStyle = generateStyleByAnimation(
      [`.${enterAnimationConfig.type}-${id}-enter`],
      {
        name: enterAnimationConfig.type,
        duration: enterAnimationConfig.duration,
        delay: enterAnimationConfig.delay,
        fillMode: 'backwards'
      }
    );
  }

  const attentionAnimationConfig = animationsConfig.attention;
  let attentionStyle = {};
  if (attentionAnimationConfig?.type) {
    attentionStyle = generateStyleByAnimation(
      [`.${attentionAnimationConfig.type}-${id}-attention`],
      {
        name: attentionAnimationConfig.type,
        duration: attentionAnimationConfig.duration,
        iterationCount: attentionAnimationConfig.repeat || 'infinite',
        delay: attentionAnimationConfig.delay
      }
    );
  }

  const exitAnimationConfig = animationsConfig.exit;
  let exitStyle = {};
  if (exitAnimationConfig?.type) {
    exitStyle = generateStyleByAnimation(
      [`.${exitAnimationConfig.type}-${id}-exit`],
      {
        name: exitAnimationConfig.type,
        duration: exitAnimationConfig.duration,
        delay: exitAnimationConfig.delay,
        fillMode: 'forwards'
      }
    );
  }

  styleManager.updateStyle({
    [id]: Object.assign({}, enterStyle, attentionStyle, exitStyle)
  });
}
