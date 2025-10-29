/**
 * @file scoped.jsx.
 * @author fex
 */

import React from 'react';
import {RendererProps} from 'amis-core';

import hoistNonReactStatic from 'hoist-non-react-statics';

import {filter} from 'amis-core';
import {Icon, TooltipWrapper} from 'amis-ui';
import {SchemaIcon, SchemaTpl} from '../Schema';

export interface AMISCopyableObject {
  /**
   * 配置图标
   */
  icon?: SchemaIcon;

  /**
   * 配置复制时的内容模板
   */
  content?: SchemaTpl;

  /**
   * 提示文字内容
   */
  tooltip?: string;
}
export type AMISCopyable = boolean | AMISCopyableObject;

// 保留原来的叫法
export type SchemaCopyableObject = AMISCopyableObject;
export type SchemaCopyable = AMISCopyable;

export interface CopyableProps extends RendererProps {
  name?: string;
  label?: string;
  copyable: SchemaCopyable;
  tooltipContainer?: any;
}

export const HocCopyable =
  () =>
  (Component: React.ComponentType<any>): any => {
    class QuickEditComponent extends React.PureComponent<CopyableProps, any> {
      static ComposedComponent = Component;
      handleClick(content: string) {
        const {env, copyFormat} = this.props;
        env.copy && env.copy(content, {format: copyFormat});
      }
      render() {
        const {
          name,
          className,
          data,
          noHoc,
          classnames: cx,
          translate: __,
          env,
          tooltipContainer
        } = this.props;
        const copyable = this.props.copyable as AMISCopyableObject;

        if (copyable && !noHoc) {
          const content = filter(
            copyable.content || '${' + name + ' | raw }',
            data
          );
          const tooltip =
            copyable?.tooltip != null
              ? filter(copyable.tooltip, data)
              : copyable?.tooltip;

          if (content) {
            return (
              <Component
                {...this.props}
                className={cx(`Field--copyable`, className)}
              >
                <Component {...this.props} contentsOnly noHoc />
                <TooltipWrapper
                  placement="right"
                  tooltip={tooltip ?? __('Copyable.tip')}
                  trigger="hover"
                  container={tooltipContainer || env?.getModalContainer}
                >
                  <a
                    key="edit-btn"
                    className={cx('Field-copyBtn')}
                    onClick={this.handleClick.bind(this, content)}
                  >
                    <Icon icon="copy" className="icon" />
                  </a>
                </TooltipWrapper>
              </Component>
            );
          }
        }
        return <Component {...this.props} />;
      }
    }
    hoistNonReactStatic(QuickEditComponent, Component);
    return QuickEditComponent;
  };

export default HocCopyable;
