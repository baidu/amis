import React, {useState, useEffect, useRef} from 'react';
import {CSSTransition} from 'react-transition-group';
import {Schema} from '../types';
import {formateId} from '../utils';
import {createAnimationStyle} from '../utils/animations';
import styleManager from '../StyleManager';

function Animations({
  schema,
  component,
  show
}: {
  schema: Schema;
  component: any;
  show: boolean;
}) {
  const idRef = useRef<string>(formateId(schema.id));
  const id = idRef.current;
  const {enter} = schema.animations || {};
  const [animationShow, setAnimationShow] = React.useState(!enter?.inView);
  const [placeholderShow, setPlaceholderShow] = React.useState(!!enter?.inView);

  const [animationClassNames] = useState(() => {
    const animations = schema?.animations;
    const animationClassNames = {
      appear: '',
      enter: '',
      exit: ''
    };
    if (animations) {
      if (animations.enter) {
        animationClassNames.enter = `${animations.enter.type}-${id}-enter`;
        animationClassNames.appear = animationClassNames.enter;
      }
      if (animations.exit) {
        animationClassNames.exit = `${animations.exit.type}-${id}-exit`;
      }
    }
    return animationClassNames;
  });
  const [animationTimeout] = useState(() => {
    const animations = schema?.animations;
    const animationTimeout = {
      enter: 1000,
      exit: 1000
    };
    if (animations) {
      if (animations.enter) {
        animationTimeout.enter =
          ((animations.enter.duration || 1) + (animations.enter.delay || 0)) *
          1000;
      }
      if (animations.exit) {
        animationTimeout.exit =
          ((animations.exit.duration || 1) + (animations.exit.delay || 0)) *
          1000;
      }
    }
    return animationTimeout;
  });

  useEffect(() => {
    createAnimationStyle(id, schema.animations!);
    return () => {
      if (schema.animations) {
        styleManager.removeStyles(id);
      }
    };
  }, []);

  function refFn(ref: HTMLDivElement) {
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry], observer) => {
          if (entry.isIntersecting) {
            setAnimationShow(true);
            setPlaceholderShow(false);
            observer.disconnect();
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      );
      if (ref) {
        observer.observe(ref);
      }
    }
  }

  function handleEntered(node: HTMLElement) {
    const {attention, exit, enter} = schema.animations || {};
    if (attention) {
      node.classList.add(`${attention.type}-${id}-attention`);
    }

    if (exit?.outView || enter?.repeat) {
      const observer = new IntersectionObserver(
        ([entry], observer) => {
          if (!entry.isIntersecting) {
            setAnimationShow(false);
            observer.disconnect();
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1
        }
      );
      observer.observe(node);
    }
  }
  function handleExit(node: HTMLElement) {
    const {attention} = schema.animations || {};
    if (attention) {
      node.classList.remove(`${attention.type}-${id}-attention`);
    }
  }

  function handleExited() {
    setPlaceholderShow(true);
  }

  return (
    <>
      {!animationShow && show && placeholderShow && (
        <div ref={refFn} className="amis-animation-placeholder">
          {component}
        </div>
      )}
      <CSSTransition
        in={animationShow && show}
        timeout={animationTimeout}
        classNames={animationClassNames}
        onEntered={handleEntered}
        onExit={handleExit}
        onExited={handleExited}
        appear
        unmountOnExit
      >
        {component}
      </CSSTransition>
    </>
  );
}

export default Animations;
