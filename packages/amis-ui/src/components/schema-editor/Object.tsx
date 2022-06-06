import React from 'react';
import {autobind, guid, JSONSchema} from 'amis-core';
import Button from '../Button';
import {Icon} from '../icons';
import InputBox from '../InputBox';
import {SchemaEditorItemCommon, SchemaEditorItemCommonProps} from './Common';
import {SchemaEditorItem} from './Item';

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
  handlePropChange(index: number, item: any) {
    const members = this.state.members.concat();
    members[index] = {
      ...members[index],
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
      enableAdvancedSetting
    } = this.props;
    const members = this.state.members;

    return (
      <div
        className={cx('SchemaEditorProps', {
          'SchemaEditorProps--depth': showInfo !== false
        })}
      >
        {members.length ? (
          members.map((member, index) => (
            <SchemaEditorItem
              key={member.id}
              types={types}
              onTypeChange={onTypeChange}
              enableAdvancedSetting={enableAdvancedSetting}
              prefix={
                <>
                  <InputBox
                    className={cx('SchemaEditor-key')}
                    hasError={member.hasError}
                    value={member.key || ''}
                    onChange={this.handlePropKeyChange.bind(this, index)}
                    placeholder={__('JSONSchema.key')}
                    disabled={disabled || !!value?.$ref}
                  />

                  <InputBox
                    className={cx('SchemaEditor-title')}
                    value={member.schema.title || ''}
                    onChange={this.handlePropTitleChange.bind(this, index)}
                    placeholder={__('JSONSchema.title')}
                    disabled={disabled || !!value?.$ref}
                  />
                </>
              }
              affix={
                <Button
                  className={cx('SchemaEditor-btn')}
                  onClick={this.handlePropRemove.bind(this, index)}
                  iconOnly
                  disabled={disabled || !!value?.$ref}
                >
                  <Icon icon="remove" className="icon" />
                </Button>
              }
              value={member.schema}
              onChange={this.handlePropChange.bind(this, index)}
              renderExtraProps={renderExtraProps}
              renderModalProps={renderModalProps}
              locale={locale}
              translate={__}
              classnames={cx}
              classPrefix={classPrefix}
              disabled={disabled || !!value?.$ref}
              required={member.required}
              onRequiredChange={this.handlePropRequiredChange.bind(this, index)}
            />
          ))
        ) : (
          <div className={cx('SchemaEditorProps-placeholder')}>
            {__('placeholder.empty')}
          </div>
        )}

        <Button
          level="link"
          onClick={this.handleAdd}
          size="xs"
          disabled={disabled || !!value?.$ref}
        >
          {__('JSONSchema.add_prop')}
        </Button>
      </div>
    );
  }

  render() {
    const {classnames: cx, showInfo, translate: __, disabled} = this.props;

    return (
      <div
        className={cx('SchemaEditorItem SchemaEditorObject', {
          'is-collapsed': this.state.collapsed
        })}
      >
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
        {this.state.collapsed ? null : this.rendererProps()}
      </div>
    );
  }
}
