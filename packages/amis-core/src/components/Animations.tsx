import React, {useEffect, useMemo, useState, useCallback} from 'react';
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
  const {enter} = schema.animations || {};
  const [animationShow, setAnimationShow] = useState(!enter?.inView);
  const [placeholderShow, setPlaceholderShow] = useState(!!enter?.inView);

  const id = useMemo(() => formateId(schema.id), []);
  const observer = useMemo(newObserver, []);
  const animationClassNames = useMemo(initAnimationClassNames, []);
  const animationTimeout = useMemo(initAnimationTimeout, []);

  useEffect(() => {
    createAnimationStyle(id, schema.animations!);
    return () => {
      if (schema.animations) {
        styleManager.removeStyles(id);
      }
      observer.disconnect();
    };
  }, []);

  function newObserver() {
    return new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (
            entry.target.getAttribute('data-role') === 'animation-placeholder'
          ) {
            if (entry.isIntersecting) {
              setAnimationShow(true);
              setPlaceholderShow(false);
              observer.unobserve(entry.target);
            }
          } else {
            if (!entry.isIntersecting) {
              setAnimationShow(false);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
  }

  function initAnimationClassNames() {
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
  }

  function initAnimationTimeout() {
    const animations = schema?.animations;
    const animationTimeout = {
      enter: 0,
      exit: 0
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
  }

  function refFn(ref: HTMLElement | null) {
    if (ref) {
      observer.observe(ref);
    }
  }

  const handleEntered = useCallback((node: HTMLElement) => {
    const {attention, exit, enter, hover} = schema.animations || {};
    if (attention) {
      node.classList.add(`${attention.type}-${id}-attention`);
    }

    if (hover) {
      node.classList.add(`${hover.type}-${id}-hover`);
      node.classList.add(`amis-${hover.type}`);
    }

    if (exit?.outView || enter?.repeat) {
      observer.observe(node);
    }
  }, []);

  const handleExit = useCallback((node: HTMLElement) => {
    const {attention, hover} = schema.animations || {};
    if (attention) {
      node.classList.remove(`${attention.type}-${id}-attention`);
    }
    if (hover) {
      node.classList.remove(`${hover.type}-${id}-hover`);
      node.classList.remove(`amis-${hover.type}`);
    }
  }, []);

  const handleExited = useCallback(() => {
    setPlaceholderShow(true);
  }, []);

  return (
    <>
      {!animationShow && show && placeholderShow && (
        <div
          ref={refFn}
          className="amis-animation-placeholder"
          data-role="animation-placeholder"
        >
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
