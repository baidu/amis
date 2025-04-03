import React from 'react';
import {autobind} from 'amis-core';
import {Icon} from '../icons';
import {ITEMMAP, SchemaEditorItemCommon} from './Common';
import {SchemaEditorItem} from './Item';
import {Controller} from '../FormField';

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
      renderModalProps,
      locale,
      translate: __,
      classPrefix,
      disabled,
      showInfo,
      types,
      onTypeChange,
      enableAdvancedSetting,
      popOverContainer,
      placeholder,
      mobileUI,
      mini
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
          dataName={this.props.dataName}
          types={types}
          onTypeChange={onTypeChange}
          label={
            types?.find(item => item.value === (items as any)?.type)?.label
          }
          prefix={
            <div className={cx('SchemaEditor-itemsLabel')}>
              {__('JSONSchema.array_items')}
            </div>
          }
          value={items as any}
          onChange={this.handleItemsChange}
          renderExtraProps={renderExtraProps}
          renderModalProps={renderModalProps}
          locale={locale}
          translate={__}
          classnames={cx}
          classPrefix={classPrefix}
          disabled={disabled || !!(items as any)?.$ref}
          enableAdvancedSetting={enableAdvancedSetting}
          popOverContainer={popOverContainer}
          placeholder={placeholder}
          mobileUI={mobileUI}
          mini={mini}
        />
      </div>
    );
  }

  render() {
    const {
      classnames: cx,
      showInfo,
      formMode,
      mini,
      disabled,
      mobileUI,
      locale,
      classPrefix,
      types,
      translate: __,
      placeholder
    } = this.props;

    if (formMode) {
      return this.renderForm({
        formAffixRender: methods => {
          return (
            <>
              <Controller
                label={__('JSONSchema.array_items')}
                name="items"
                control={methods.control}
                render={({field}) => (
                  <SchemaEditorItem
                    {...field}
                    types={types}
                    placeholder={placeholder}
                    mobileUI={mobileUI}
                    locale={locale}
                    translate={__}
                    classnames={cx}
                    classPrefix={classPrefix}
                    mini={false}
                  />
                )}
              />
            </>
          );
        }
      });
    }

    return (
      <div
        className={cx('SchemaEditorItem SchemaEditorArray', {
          'SchemaEditorItem--mini': mini
        })}
        data-amis-name={this.props.dataName}
      >
        {showInfo !== false ? (
          <>
            {mini ? null : (
              <a
                className={cx('SchemaEditor-caret', {
                  'is-collapsed': this.state.collapsed
                })}
                onClick={this.toggleCollapsed}
              >
                <Icon icon="caret" className="icon" />
              </a>
            )}
            {this.renderCommon()}
          </>
        ) : null}
        {this.state.collapsed || mini ? null : this.renderItems()}
      </div>
    );
  }
}

ITEMMAP.array = SchemaEditorItemArray;
