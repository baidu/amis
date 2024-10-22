export interface AnimationsProps {
  enter?: {
    type: string;
    duration?: number;
  };
  attention?: {
    type: string;
    duration?: number;
  };
  exit?: {
    type: string;
    duration?: number;
  };
}

function generateStyleByAnimation(
  type: string,
  className: string[],
  duration?: number,
  animation?: string
) {
  let style = `
    animation: ${type} ${duration || 0.3}s ${animation || 'ease'};
  `;

  return `${className.join(',')} {${style}}`;
}

function createStyle(id: string, animationStyle: string) {
  let classStyle = document.getElementById(`animation-${id}`);
  let style = '';
  if (classStyle) {
    style = classStyle.innerHTML;
    classStyle.remove();
  } else {
    classStyle = document.createElement('style');
    classStyle.id = `animation-${id}`;
  }
  style += animationStyle;
  classStyle.innerHTML = style;
  document.body.appendChild(classStyle);
}

export function createAnimationStyle(
  id: string,
  animationsConfig: AnimationsProps
) {
  const enterAnimationConfig = animationsConfig.enter;
  let enterStyle = '';
  if (enterAnimationConfig?.type) {
    enterStyle = generateStyleByAnimation(
      enterAnimationConfig.type,
      [
        `.${enterAnimationConfig.type}-${id}-appear`,
        `.${enterAnimationConfig.type}-${id}-enter`
      ],
      enterAnimationConfig.duration
    );
  }

  const attentionAnimationConfig = animationsConfig.attention;
  let attentionStyle = '';
  if (attentionAnimationConfig?.type) {
    attentionStyle = generateStyleByAnimation(
      attentionAnimationConfig.type,
      [`.${attentionAnimationConfig.type}-${id}-attention`],
      attentionAnimationConfig.duration,
      'ease infinite'
    );
  }

  const exitAnimationConfig = animationsConfig.exit;
  let exitStyle = '';
  if (exitAnimationConfig?.type) {
    exitStyle = generateStyleByAnimation(
      exitAnimationConfig.type,
      [`.${exitAnimationConfig.type}-${id}-exit`],
      exitAnimationConfig.duration
    );
  }

  createStyle(id, enterStyle + attentionStyle + exitStyle);
}
