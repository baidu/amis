import {LazyComponent, Icon} from 'amis';
import React from 'react';
import {resizeSensor, render} from 'amis';
import {Schema} from 'amis/lib/types';

interface ThumbProps {
  schema: Schema;
  theme?: string;
  env: any;
}
interface ThumbStates {
  scale: Boolean;
}

export class RendererThumb extends React.Component<ThumbProps, ThumbStates> {
  ref: HTMLDivElement;
  unSensor: Function;

  constructor(props: ThumbProps) {
    super(props);
    this.state = {
      scale: true
    };
    this.rootRef = this.rootRef.bind(this);
    this.syncHeight = this.syncHeight.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  env = {
    session: 'preview',
    ...this.props.env
  };

  componentWillUnmount() {
    this.unSensor && this.unSensor();
  }

  rootRef(ref: HTMLDivElement) {
    this.ref = ref;

    if (ref) {
      this.syncHeight();
      this.unSensor = resizeSensor(
        ref.firstChild?.firstChild as HTMLElement,
        this.syncHeight
      );
    }
  }

  syncHeight() {
    if (!this.ref) {
      return;
    }
    const scale = this.state.scale;
    const child = this.ref.firstChild as HTMLElement;
    this.ref.style.cssText = `height: ${
      child.scrollHeight / (scale ? 2 : 1)
    }px;`;
  }

  handleClick(e: React.MouseEvent) {
    e.preventDefault();
    this.setState({
      scale: !this.state.scale
    });
  }

  render() {
    const {schema, theme} = this.props;

    return (
      <LazyComponent
        unMountOnHidden={false}
        schema={schema}
        component={({schema}) => (
          <div
            className={`ae-RenderersPicker-thumb ${
              this.state.scale ? 'is-scaled' : ''
            }`}
          >
            <div className="ae-Editor-rendererThumbWrap">
              <div
                className="ae-Editor-rendererThumbIcon"
                onClick={this.handleClick}
              >
                <Icon icon={this.state.scale ? 'zoom-in' : 'zoom-out'} />
              </div>
              <div ref={this.rootRef} className={`ae-Editor-rendererThumb`}>
                <div className="ae-Editor-rendererThumbInner">
                  {render(
                    {
                      ...schema,
                      mode:
                        schema.mode === 'horizontal' ? 'normal' : schema.mode
                    },
                    {
                      theme
                    },
                    this.env
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      />
    );
  }
}
