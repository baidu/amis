import React from 'react';
import {guid} from 'amis-core';
import Button from '../Button';
import {Icon} from '../icons';
import InputBox from '../InputBox';
import InputBoxWithSuggestion from '../InputBoxWithSuggestion';
import Select from '../Select';
import type {InputJSONSchemaItemProps} from './index';
import InputJSONSchemaItem from './Item';
import isEqual from 'lodash/isEqual';

type JSONSchemaObjectMember = {
  key: string;
  name: string;
  nameMutable?: boolean;
  schema?: any;
  invalid?: 'key' | 'value';
  required?: boolean;
  value?: any;
};
export function InputJSONSchemaObject(
  props: InputJSONSchemaItemProps,
  ref: any
) {
  const {
    classnames: cx,
    value,
    onChange,
    disabled,
    translate: __,
    renderKey,
    collapsable,
    renderValue,
    mobileUI,
    className,
    addButtonText
  } = props;
  const buildMembers = React.useCallback((schema: any, value: any) => {
    const members: Array<JSONSchemaObjectMember> = [];
    const required = Array.isArray(schema.required) ? schema.required : [];

    Object.keys(schema.properties || {}).forEach(key => {
      const child = schema.properties[key];
      members.push({
        key: guid(),
        name: key,
        nameMutable: !required.includes(key),
        required: required.includes(key),
        schema: child,
        value: value?.[key] ?? child.default
      });
    });

    const keys = Object.keys(value || {});
    for (let key of keys) {
      const exists = members.find(m => m.name === key);
      if (!exists && schema.additionalProperties !== false) {
        members.push({
          key: guid(),
          name: key,
          nameMutable: true,
          schema: {
            type: 'string',
            default: ''
          },
          value: value[key] ?? ''
        });
      }
    }

    if (!members.length && schema.additionalProperties !== false) {
      members.push({
        key: guid(),
        name: '',
        nameMutable: true,
        schema: {
          type: 'string',
          default: ''
        },
        value: ''
      });
    }

    return members;
  }, []);

  const [members, _setMembers] = React.useState<Array<JSONSchemaObjectMember>>(
    []
  );
  const membersRef = React.useRef<Array<JSONSchemaObjectMember>>();
  membersRef.current = members;
  const setMembers = (members: Array<JSONSchemaObjectMember>) => {
    _setMembers(members);
    membersRef.current = members;
  };

  const [collapsed, setCollapsed] = React.useState<boolean>(
    collapsable ? true : false
  );
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const emitChange = () => {
    const members: Array<JSONSchemaObjectMember> = membersRef.current!;
    const value: any = {};

    members.forEach(member => {
      if (
        !member.invalid &&
        (typeof member.value !== 'undefined' ||
          typeof value[member.name] !== 'undefined')
      ) {
        value[member.name] = member.value;
      }
    });

    if (!isEqual(value, props.value || {})) {
      onChange?.(value);
    }
  };

  const onMemberChange = (member: JSONSchemaObjectMember, memberValue: any) => {
    const arr = members.concat();
    const idx = arr.indexOf(member);
    if (!~idx) {
      throw new Error('member object not found');
    }

    arr.splice(idx, 1, {
      ...arr[idx],
      value: memberValue
    });

    setMembers(arr);
    emitChange();
  };
  const onMemberKeyChange = (
    member: JSONSchemaObjectMember,
    memberKey: any
  ) => {
    const idx = members.indexOf(member);
    if (!~idx) {
      throw new Error('member object not found');
    }

    const originSchema = members[idx].schema;
    const schema: any = props.schema?.properties?.[memberKey] || {
      type: 'string',
      default: ''
    };

    const arr = members.concat();
    const item: JSONSchemaObjectMember = {
      ...member,
      schema: schema,
      name: memberKey,
      invalid:
        !memberKey || members.some((a, b) => a.name === memberKey && b !== idx)
          ? 'key'
          : undefined
    };

    if (
      item.value === originSchema.default &&
      originSchema !== schema &&
      originSchema.default !== schema.default
    ) {
      item.value = schema.default;
    }

    arr.splice(idx, 1, item);

    setMembers(arr);
    emitChange();
  };
  const onMemberDelete = (member: JSONSchemaObjectMember) => {
    const idx = members.indexOf(member);
    if (!~idx) {
      throw new Error('member object not found');
    }

    const arr = members.concat();
    arr.splice(idx, 1);
    setMembers(arr);
    emitChange();
  };

  React.useEffect(() => {
    const members = buildMembers(props.schema, props.value);
    setMembers(members);
    emitChange();
  }, [JSON.stringify(props.schema)]);

  React.useEffect(() => {
    const value = props.value;
    const arr = membersRef.current!.concat();
    const keys = Object.keys(value || {});
    for (let key of keys) {
      const idx = arr.findIndex(m => m.name === key);
      const exists = arr[idx];
      if (!exists && props.schema.additionalProperties !== false) {
        arr.push({
          key: guid(),
          name: key,
          nameMutable: true,
          schema: {
            type: 'string',
            default: ''
          },
          value: value?.[key] ?? ''
        });
      } else if (exists) {
        // 当 value 的 key 在 members 中存在时，再修改
        arr.splice(idx, 1, {
          ...exists,
          value: value?.[key]
        });
      }
    }
    setMembers(arr);
  }, [JSON.stringify(props.value)]);

  const handleAdd = React.useCallback(() => {
    const arr = members.concat();
    arr.push({
      key: guid(),
      name: '',
      invalid: 'key',
      nameMutable: true,
      schema: {
        type: 'string',
        default: ''
      },
      value: ''
    });
    setMembers(arr);
    emitChange();
  }, [members]);

  const options: Array<any> = [];
  const properties: any = props.schema?.properties || {};
  Object.keys(properties).forEach(key => {
    options.push({
      label: properties[key]?.title || key,
      value: key
    });
  });
  // todo additionalProperties 还有其他格式
  const allowAdd = !(
    props.schema.additionalProperties === false &&
    options.every(o => members.find(m => m.name === o.value))
  );
  const allowInput = props.schema.additionalProperties !== false;

  React.useImperativeHandle(ref, () => {
    return {
      validate(): any {
        if (membersRef.current?.some(m => m.invalid === 'key')) {
          return __('JSONSchema.key_invalid');
        }
      }
    };
  });

  return (
    <>
      {collapsable ? (
        <a
          className={cx('JSONSchemaObject-caret', {
            'is-collapsed': collapsed
          })}
          onClick={toggleCollapsed}
        >
          <Icon icon="right-arrow-bold" className="icon" />
        </a>
      ) : null}

      <div
        className={cx('JSONSchemaObject', className, {
          'is-mobile': mobileUI,
          'is-expanded': collapsable && !collapsed
        })}
      >
        {collapsed ? (
          renderValue ? (
            <InputJSONSchemaItem
              {...props}
              value={value}
              onChange={onChange}
              schema={{
                type: 'string'
              }}
              placeholder={props.schema?.description}
            />
          ) : null
        ) : (
          members.map(member => {
            const filtedOptions = options.filter(
              o => !members.find(m => m !== member && m.name === o.value)
            );

            return (
              <div key={member.key} className={cx('JSONSchemaMember')}>
                <div
                  className={cx('JSONSchemaMember-key', {
                    'is-mobile': mobileUI
                  })}
                >
                  {member.nameMutable ? (
                    <>
                      {renderKey ? (
                        renderKey(
                          member.name,
                          onMemberKeyChange.bind(null, member),
                          member.schema,
                          props
                        )
                      ) : filtedOptions.length ? (
                        allowInput ? (
                          <InputBoxWithSuggestion
                            value={member.name}
                            hasError={member.invalid === 'key'}
                            onChange={onMemberKeyChange.bind(null, member)}
                            clearable={false}
                            placeholder={__('JSONSchema.key')}
                            options={filtedOptions}
                            mobileUI={mobileUI}
                          />
                        ) : (
                          <Select
                            simpleValue
                            block
                            value={member.name}
                            hasError={member.invalid === 'key'}
                            onChange={onMemberKeyChange.bind(null, member)}
                            clearable={false}
                            placeholder={__('JSONSchema.key')}
                            options={filtedOptions}
                            mobileUI={mobileUI}
                          />
                        )
                      ) : (
                        <InputBox
                          value={member.name}
                          hasError={member.invalid === 'key'}
                          onChange={onMemberKeyChange.bind(null, member)}
                          clearable={false}
                          placeholder={__('JSONSchema.key')}
                          mobileUI={mobileUI}
                        />
                      )}
                    </>
                  ) : (
                    <span>
                      {member.required ? (
                        <span className={cx(`Form-star`)}>*</span>
                      ) : null}
                      {member.schema?.title || member.name}

                      {/* {member.schema?.description ? (
                        <TooltipWrapper
                          tooltipTheme="dark"
                          tooltip={member.schema.description}
                          trigger="click"
                          rootClose
                        >
                          <div className={cx(`Remark`, `Remark--warning`)}>
                            <span className={cx('Remark-icon icon')}>
                              <Icon icon="question-mark" />
                            </span>
                          </div>
                        </TooltipWrapper>
                      ) : null} */}
                    </span>
                  )}
                </div>
                <div className={cx('JSONSchemaMember-value')}>
                  <InputJSONSchemaItem
                    {...props}
                    className=""
                    addButtonText={undefined}
                    required={member.required}
                    value={value?.[member.name]}
                    onChange={onMemberChange.bind(null, member)}
                    schema={
                      member.schema || {
                        type: 'string'
                      }
                    }
                    placeholder={member.schema?.description}
                    collapsable
                  />
                </div>
                {!member.required ? (
                  <Button
                    className={cx('SchemaEditor-btn')}
                    onClick={onMemberDelete.bind(null, member)}
                    iconOnly
                    disabled={disabled || !!value?.$ref}
                  >
                    <Icon icon="remove" className="icon" />
                  </Button>
                ) : null}
              </div>
            );
          })
        )}

        {allowAdd && !collapsed ? (
          <Button
            level="link"
            onClick={handleAdd}
            size="xs"
            disabled={disabled}
          >
            {addButtonText ?? __('JSONSchema.add_prop')}
          </Button>
        ) : null}
      </div>
    </>
  );
}

export default React.forwardRef(InputJSONSchemaObject);
