import React from 'react';
import {autobind, guid, JSONSchema} from 'amis-core';
import Button from '../Button';
import {Icon} from '../icons';
import InputBox from '../InputBox';
import {ITEMMAP, SchemaEditorItemCommon} from './Common';
import {SchemaEditorItem} from './Item';

import type {SchemaEditorItemCommonProps} from './Common';
import PickerContainer from '../PickerContainer';
import {Controller} from '../FormField';
import Checkbox from '../Checkbox';
import {UseFormReturn} from 'react-hook-form';

export interface SchemaEditorItemObjectState {
  members: Array<{
    id: string;
    key: string;
    hasError?: boolean;
    required?: boolean;
    schema: JSONSchema;
  }>;
  collapsed: boolean;
}

export class SchemaEditorItemObject extends SchemaEditorItemCommon<
  SchemaEditorItemCommonProps,
  SchemaEditorItemObjectState
> {
  state = {
    members: this.propsToMembers(this.props),
    collapsed: false
  };

  lastValue: any;

  componentDidUpdate(prevProps: SchemaEditorItemCommonProps) {
    const props = this.props;

    // 外部属性变化，更新 state
    if (
      props.value !== prevProps.value &&
      JSON.stringify(props.value) !== JSON.stringify(this.lastValue)
    ) {
      this.setState({
        members: this.propsToMembers(props)
      });
    }
  }

  propsToMembers(props: SchemaEditorItemCommonProps) {
    const members: Array<{
      id: string;
      key: string;
      hasError?: boolean;
      required?: boolean;
      schema: JSONSchema;
    }> = [];
    const required = Array.isArray(props.value?.required)
      ? props.value!.required
      : [];

    if (props.value?.properties) {
      const properties = props.value.properties;
      Object.keys(properties).forEach(key => {
        const value = properties[key] as any;

        members.push({
          id: guid(),
          key: key || '',
          hasError: !key || members.some(i => i.key === key),
          required: !!~required.indexOf(key),
          schema: value
        });
      });
    }

    return members;
  }

  @autobind
  pipeOut() {
    const members = this.state.members;
    const {value, onChange} = this.props;
    const properties: any = {};
    const required: Array<string> = [];

    members
      .filter(item => !item.hasError)
      .forEach(member => {
        properties[member.key] = member.schema;

        if (member.required) {
          required.push(member.key);
        }
      });

    this.lastValue = {
      ...value,
      properties,
      required
    };
    onChange?.(this.lastValue);
  }

  @autobind
  handleAdd() {
    const members = this.state.members.concat();
    members.push({
      id: guid(),
      key: '',
      hasError: true,
      required: false,
      schema: {
        type: 'string'
      }
    });

    this.setState(
      {
        members
      },
      this.pipeOut
    );
  }

  @autobind
  handleAddProppertyConfirm({key, isRequired: required, ...value}: any) {
    const members = this.state.members.concat();

    if (members.some(member => member.key === key)) {
      throw new Error(this.props.translate('JSONSchema.key_duplicated'));
    }

    members.push({
      id: guid(),
      key: key || '',
      hasError: false,
      required: required,
      schema: value
    });
    this.setState(
      {
        members
      },
      this.pipeOut
    );
  }

  @autobind
  handleEditProppertyConfirm(index: number, value: any) {
    const exists = this.state.members.some(
      (m, i) => i !== index && m.key === value.key
    );

    if (exists) {
      throw new Error(this.props.translate('JSONSchema.key_duplicated'));
    }
  }

  @autobind
  handlePropKeyChange(index: number, key: string) {
    const members = this.state.members.concat();
    members[index] = {
      ...members[index],
      key,
      hasError: !key || members.some((m, i) => i !== index && m.key === key)
    };

    this.setState({members}, this.pipeOut);
  }

  @autobind
  handlePropTitleChange(index: number, title: string) {
    const members = this.state.members.concat();
    members[index] = {
      ...members[index],
      schema: {
        ...members[index].schema,
        title
      }
    };

    this.setState({members}, this.pipeOut);
  }

  @autobind
  handlePropRemove(index: number) {
    const members = this.state.members.concat();
    members.splice(index, 1);
    this.setState({members}, this.pipeOut);
  }

  @autobind
  handlePropChange(index: number, {key, isRequired: required, ...item}: any) {
    const {mini} = this.props;
    const members = this.state.members.concat();
    members[index] = {
      ...members[index],
      ...(mini
        ? {
            key,
            required
          }
        : undefined),
      schema: {
        ...item
      }
    };

    this.setState({members}, this.pipeOut);
  }

  @autobind
  handlePropRequiredChange(index: number, required: boolean) {
    const members = this.state.members.concat();
    members[index] = {
      ...members[index],
      required
    };

    this.setState({members}, this.pipeOut);
  }

  @autobind
  toggleCollapsed() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  @autobind
  renderFormPrefix(
    methods: UseFormReturn & {
      onSubmit: (value: any) => void;
    }
  ) {
    const {placeholder, mobileUI, classnames: cx, translate: __} = this.props;
    return (
      <>
        <Controller
          label={__('JSONSchema.key')}
          name="key"
          control={methods.control}
          rules={{maxLength: 20, isVariableName: true}}
          isRequired
          render={({field}) => (
            <InputBox
              {...field}
              placeholder={__(placeholder?.key ?? '')}
              mobileUI={mobileUI}
            />
          )}
        />

        <Controller
          label={__('JSONSchema.required')}
          name="isRequired"
          control={methods.control}
          render={({field}) => (
            <Checkbox
              {...field}
              value={!!field.value}
              className={cx('SchemaEditor-required')}
              label={__('Required')}
            />
          )}
        />
      </>
    );
  }

  rendererProps() {
    const {
      value,
      translate: __,
      classnames: cx,
      renderExtraProps,
      renderModalProps,
      locale,
      classPrefix,
      disabled,
      showInfo,
      types,
      onTypeChange,
      enableAdvancedSetting,
      popOverContainer,
      placeholder,
      mobileUI,
      mini,
      addButtonText,
      dataName
    } = this.props;
    const members = this.state.members;

    return (
      <div
        className={cx('SchemaEditorProps', {
          'SchemaEditorProps--depth': showInfo !== false
        })}
      >
        {members.length ? (
          members.map((member, index) => {
            const memberKey = dataName
              ? dataName + '-' + member.key
              : member.key;
            return (
              <SchemaEditorItem
                dataName={memberKey}
                mobileUI={mobileUI}
                mini={mini}
                key={member.id}
                types={types}
                onTypeChange={onTypeChange}
                enableAdvancedSetting={enableAdvancedSetting}
                popOverContainer={popOverContainer}
                prefix={
                  mini ? undefined : (
                    <>
                      <InputBox
                        className={cx('SchemaEditor-key')}
                        hasError={member.hasError}
                        value={member.key || ''}
                        onChange={this.handlePropKeyChange.bind(this, index)}
                        placeholder={__(placeholder?.key ?? '')}
                        disabled={disabled || !!value?.$ref}
                        mobileUI={mobileUI}
                        dataName={`${memberKey}-key`}
                      />

                      <InputBox
                        className={cx('SchemaEditor-title')}
                        value={member.schema.title || ''}
                        onChange={this.handlePropTitleChange.bind(this, index)}
                        placeholder={__(placeholder?.title ?? '')}
                        disabled={disabled || !!value?.$ref}
                        mobileUI={mobileUI}
                        dataName={`${memberKey}-title`}
                      />
                    </>
                  )
                }
                affix={
                  <Button
                    className={cx('SchemaEditor-btn')}
                    onClick={this.handlePropRemove.bind(this, index)}
                    iconOnly={!mini}
                    level={mini ? 'link' : 'default'}
                    disabled={disabled || !!value?.$ref}
                  >
                    <Icon icon="remove" className="icon" />
                  </Button>
                }
                value={
                  mini
                    ? ({
                        ...member.schema,
                        key: member.key,
                        isRequired: member.required
                      } as any)
                    : member.schema
                }
                onChange={this.handlePropChange.bind(this, index)}
                onFormConfirm={this.handleEditProppertyConfirm.bind(
                  this,
                  index
                )}
                renderExtraProps={renderExtraProps}
                renderModalProps={renderModalProps}
                locale={locale}
                translate={__}
                classnames={cx}
                classPrefix={classPrefix}
                disabled={disabled || !!value?.$ref}
                required={member.required}
                onRequiredChange={this.handlePropRequiredChange.bind(
                  this,
                  index
                )}
                placeholder={placeholder}
                formPrefixRender={this.renderFormPrefix}
              />
            );
          })
        ) : (
          <div className={cx('SchemaEditorProps-placeholder')}>
            {__(placeholder?.empty ?? '')}
          </div>
        )}

        {mini ? (
          <PickerContainer
            mobileUI={mobileUI}
            value={{
              type: 'string'
            }}
            bodyRender={({isOpened, value, onChange, ref}: any) => {
              return isOpened ? (
                <SchemaEditorItem
                  types={types}
                  value={value}
                  onChange={onChange}
                  renderExtraProps={renderExtraProps}
                  renderModalProps={renderModalProps}
                  locale={locale}
                  translate={__}
                  classnames={cx}
                  classPrefix={classPrefix}
                  disabled={disabled}
                  onTypeChange={this.handleTypeChange}
                  enableAdvancedSetting={enableAdvancedSetting}
                  popOverContainer={popOverContainer}
                  placeholder={placeholder}
                  mobileUI={mobileUI}
                  mini={mini}
                  formRef={ref}
                  formMode
                  formPrefixRender={this.renderFormPrefix}
                />
              ) : null;
            }}
            beforeConfirm={this.handleBeforeSubmit}
            onConfirm={this.handleAddProppertyConfirm}
            title={__('JSONSchema.add_prop')}
            popOverContainer={popOverContainer}
          >
            {({onClick}) => (
              <Button
                level="enhance"
                block
                onClick={onClick}
                size="sm"
                disabled={disabled || !!value?.$ref}
              >
                {addButtonText ?? __('JSONSchema.add_prop')}
              </Button>
            )}
          </PickerContainer>
        ) : (
          <Button
            level="link"
            onClick={this.handleAdd}
            size="xs"
            disabled={disabled || !!value?.$ref}
          >
            {addButtonText ?? __('JSONSchema.add_prop')}
          </Button>
        )}
      </div>
    );
  }

  render() {
    const {
      classnames: cx,
      showInfo,
      translate: __,
      formMode,
      disabled,
      locale,
      classPrefix,
      mini,
      types,
      placeholder,
      mobileUI,
      expandMembers
    } = this.props;

    if (formMode) {
      return this.renderForm({
        formAffixRender: methods => {
          return (
            <>
              <Controller
                label={__('JSONSchema.members')}
                name="properties"
                control={methods.control}
                render={({field}) => (
                  <SchemaEditorItem
                    {...field}
                    types={types}
                    value={{
                      type: 'object',
                      required: [],
                      properties: field.value
                    }}
                    onChange={(value: any) => field.onChange(value.properties)}
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
        className={cx('SchemaEditorItem SchemaEditorObject', {
          'is-collapsed': this.state.collapsed,
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
        {this.state.collapsed || (mini && expandMembers !== true)
          ? null
          : this.rendererProps()}
      </div>
    );
  }
}

ITEMMAP.object = SchemaEditorItemObject;
