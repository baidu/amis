import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import Collapse from '../Collapse';
import cx from 'classnames';

export interface FieldSetProps extends RendererProps {
  title?: string;
  collapsed?: boolean;
  mode?: 'normal' | 'inline' | 'horizontal' | 'row';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'base';
  formClassName?: string;
  collapsable?: boolean;
  horizontal: {
    left: string;
    right: string;
    offset: string;
  };
}

export default class FieldSetControl extends React.Component<
  FieldSetProps,
  any
> {
  constructor(props: FieldSetProps) {
    super(props);
    this.renderBody = this.renderBody.bind(this);
  }

  static defaultProps = {
    headingClassName: '',
    collapsable: false
  };

  renderBody(): JSX.Element {
    const {
      renderFormItems,
      controls,
      body,
      collapsable,
      horizontal,
      render,
      mode,
      formMode,
      $path,
      classnames: cx,
      store,
      formClassName
    } = this.props;

    if (!controls) {
      return render('body', body) as JSX.Element;
    }

    let props: any = {
      store,
      data: store!.data,
      render
    };
    mode && (props.mode = mode);
    typeof collapsable !== 'undefined' && (props.collapsable = collapsable);
    horizontal && (props.horizontal = horizontal);

    return (
      <div
        className={cx(
          `Form--${props.mode || formMode || 'normal'}`,
          formClassName
        )}
      >
        {renderFormItems(
          {controls},
          ($path as string).replace(/^.*form\//, ''),
          props
        )}
      </div>
    );
  }

  render() {
    const {controls, className, mode, ...rest} = this.props;

    return (
      <Collapse
        {...rest}
        className={className}
        children={this.renderBody}
        wrapperComponent="fieldset"
        headingComponent="header"
      />
    );
  }
}

@Renderer({
  test: /(^|\/)form(?:.+)?\/control\/fieldSet$/i,
  weight: -100,
  name: 'fieldset'
})
export class FieldSetRenderer extends FieldSetControl {}
