import React from 'react';
import {Renderer, RendererProps} from '../../factory';
import Panel from '../Panel';
import {Schema} from '../../types';
import cx from 'classnames';

@Renderer({
  test: /(^|\/)form(?:\/.+)?\/control\/(?:\d+\/)?panel$/,
  weight: -100,
  name: 'panel-control'
})
export class PanelRenderer extends Panel {
  renderBody(): JSX.Element | null {
    const {
      render,
      renderFormItems,
      body,
      bodyClassName,
      controls,
      tabs,
      fieldSet,
      mode,
      formMode,
      horizontal,
      $path,
      classPrefix: ns
    } = this.props;

    if (!body && (controls || tabs || fieldSet)) {
      let props: any = {};
      mode && (props.mode = mode);
      horizontal && (props.horizontal = horizontal);

      return (
        <div
          className={cx(
            `${ns}Form--${props.mode || formMode || 'normal'}`,
            bodyClassName
          )}
        >
          {renderFormItems(
            {
              controls,
              tabs,
              fieldSet
            },
            ($path as string).replace(/^.*form\//, ''),
            props
          )}
        </div>
      );
    }

    return super.renderBody();
  }
}
