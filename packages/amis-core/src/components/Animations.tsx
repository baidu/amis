import React from 'react';
import {useEffect, useRef} from 'react';
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
  const animationClassNames = useRef<{
    appear?: string;
    enter?: string;
    exit?: string;
  }>({});
  const animationTimeout = useRef<{
    enter?: number;
    exit?: number;
  }>({});
  const ref = useRef<HTMLDivElement>(null);
  const [animationShow, setAnimationShow] = React.useState(false);

  useEffect(() => {
    const animations = schema?.animations;
    if (animations) {
      let id = schema.id;
      id = formateId(id);
      if (animations.enter) {
        animationTimeout.current.enter =
          ((animations.enter.duration || 1) + (animations.enter.delay || 0)) *
          1000;
        animationClassNames.current.enter = `${animations.enter.type}-${id}-enter`;
        animationClassNames.current.appear = animationClassNames.current.enter;
      }
      if (animations.exit) {
        animationTimeout.current.exit =
          ((animations.exit.duration || 1) + (animations.exit.delay || 0)) *
          1000;
        animationClassNames.current.exit = `${animations.exit.type}-${id}-exit`;
      }
      createAnimationStyle(id, animations);
    }
    return () => {
      if (schema.animations) {
        let {id} = schema;
        id = formateId(id);
        styleManager.removeStyles(id);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimationShow(true);
            observer.disconnect();
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
  }, [show]);

  function addAnimationAttention(node: HTMLElement) {
    const {attention} = schema.animations || {};
    if (attention) {
      let {id} = schema;
      id = formateId(id);
      node.classList.add(`${attention.type}-${id}-attention`);
    }
  }
  function removeAnimationAttention(node: HTMLElement) {
    const {attention} = schema.animations || {};
    if (attention) {
      let {id} = schema;
      id = formateId(id);
      node.classList.remove(`${attention.type}-${id}-attention`);
    }
  }

  return (
    <>
      {!animationShow && show && (
        <div ref={ref} className="amis-animation-placeholder">
          {component}
        </div>
      )}
      <CSSTransition
        in={animationShow && show}
        timeout={animationTimeout.current}
        classNames={animationClassNames.current}
        onEntered={addAnimationAttention}
        onExit={removeAnimationAttention}
        appear
        unmountOnExit
      >
        {component}
      </CSSTransition>
    </>
  );
}

export default Animations;
