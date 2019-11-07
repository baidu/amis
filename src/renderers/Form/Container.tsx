import React from 'react';
import {Renderer} from '../../factory';
import cx from 'classnames';
import Container from '../Container';
import FormItem, {FormControlProps} from './Item';

export interface ContainerProps extends FormControlProps {}

@FormItem({
  type: 'container',
  strictMode: false,
  sizeMutable: false
})
export class ContainerControlRenderer extends Container<ContainerProps> {
  renderBody(): JSX.Element | null {
    const {
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
      classPrefix: ns,
      store,
      render
    } = this.props;

    if (!body && (controls || tabs || fieldSet)) {
      let props: any = {
        store,
        data: store.data,
        render
      };
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
