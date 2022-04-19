import React from 'react';
import {autobind} from '../../utils/helper';
import {Icon} from '../icons';
import {SchemaEditorItemCommon} from './Common';
import {SchemaEditorItem} from './Item';

export class SchemaEditorItemArray extends SchemaEditorItemCommon {
  state = {
    collapsed: false
  };

  @autobind
  toggleCollapsed() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  @autobind
  handleItemsChange(items: any) {
    const value: any = {
      ...this.props.value,
      type: 'array',
      items
    };
    this.props.onChange?.(value);
  }

  renderItems() {
    const {
      classnames: cx,
      value,
      renderExtraProps,
      locale,
      translate: __,
      classPrefix,
      disabled,
      showInfo,
      types,
      onTypeChange
    } = this.props;
    const items = value?.items || {
      type: 'string'
    };

    return (
      <div
        className={cx('SchemaEditorProps SchemaEditorArrayProps', {
          'SchemaEditorProps--depth': showInfo !== false
        })}
      >
        <SchemaEditorItem
          types={types}
          onTypeChange={onTypeChange}
          prefix={
            <div className={cx('SchemaEditor-itemsLabel')}>
              {__('JSONSchema.array_items')}
            </div>
          }
          value={items as any}
          onChange={this.handleItemsChange}
          renderExtraProps={renderExtraProps}
          locale={locale}
          translate={__}
          classnames={cx}
          classPrefix={classPrefix}
          disabled={disabled || !!(items as any)?.$ref}
        />
      </div>
    );
  }

  render() {
    const {classnames: cx, showInfo, disabled} = this.props;

    return (
      <div className={cx('SchemaEditorItem SchemaEditorArray')}>
        {showInfo !== false ? (
          <>
            <a
              className={cx('SchemaEditor-caret', {
                'is-collapsed': this.state.collapsed
              })}
              onClick={this.toggleCollapsed}
            >
              <Icon icon="caret" className="icon" />
            </a>
            {this.renderCommon()}
          </>
        ) : null}
        {this.state.collapsed ? null : this.renderItems()}
      </div>
    );
  }
}
