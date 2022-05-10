import React from 'react';
import {guid} from '../../utils/helper';
import Button from '../Button';
import {Icon} from '../icons';
import InputBox from '../InputBox';
import InputBoxWithSuggestion from '../InputBoxWithSuggestion';
import Select from '../Select';
import type {InputJSONSchemaItemProps} from './index';
import {InputJSONSchemaItem} from './Item';

type JSONSchemaObjectMember = {
  key: string;
  name: string;
  nameMutable?: boolean;
  schema?: any;
  invalid?: boolean;
  required?: boolean;
};
export function InputJSONSchemaObject(props: InputJSONSchemaItemProps) {
  const {
    classnames: cx,
    value,
    onChange,
    disabled,
    translate: __,
    renderKey,
    collapsable,
    renderValue
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
        schema: child
      });
    });

    const keys = Object.keys(value || {});
    for (let key of keys) {
      const exists = members.find(m => m.name === key);
      if (!exists) {
        members.push({
          key: guid(),
          name: key,
          nameMutable: true,
          schema: {
            type: 'string'
          }
        });
      }
    }

    if (!members.length) {
      members.push({
        key: guid(),
        name: '',
        nameMutable: true,
        schema: {
          type: 'string'
        }
      });
    }

    return members;
  }, []);

  const [members, setMembers] = React.useState<Array<JSONSchemaObjectMember>>(
    buildMembers(props.schema, props.value)
  );
  const membersRef = React.useRef<Array<JSONSchemaObjectMember>>();
  membersRef.current = members;

  const [collapsed, setCollapsed] = React.useState<boolean>(
    collapsable ? true : false
  );
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onMemberChange = (member: JSONSchemaObjectMember, memberValue: any) => {
    const newValue = {
      ...props.value,
      [member.name]: memberValue
    };
    onChange?.(newValue);
  };
  const onMemberKeyChange = (
    member: JSONSchemaObjectMember,
    memberValue: any
  ) => {
    const idx = members.indexOf(member);
    if (!~idx) {
      throw new Error('member object not found');
    }

    const m = members.concat();
    m.splice(idx, 1, {
      ...member,
      schema: props.schema?.properties?.[memberValue] || {
        type: 'string'
      },
      name: memberValue,
      invalid:
        !memberValue ||
        members.some((a, b) => a.name === memberValue && b !== idx)
    });

    setMembers(m);
  };
  const onMemberDelete = (member: JSONSchemaObjectMember) => {
    const idx = members.indexOf(member);
    if (!~idx) {
      throw new Error('member object not found');
    }

    const m = members.concat();
    m.splice(idx, 1);
    setMembers(m);

    const newValue = {
      ...props.value
    };
    delete newValue[member.name];
    onChange?.(newValue);
  };

  React.useEffect(() => {
    setMembers(buildMembers(props.schema, props.value));
  }, [JSON.stringify(props.schema)]);

  React.useEffect(() => {
    const value = props.value;
    const m = membersRef.current!.concat();
    const keys = Object.keys(value || {});
    for (let key of keys) {
      const exists = m.find(m => m.name === key);
      if (!exists) {
        m.push({
          key: guid(),
          name: key,
          nameMutable: true,
          schema: {
            type: 'string'
          }
        });
      }
    }
    if (m.length !== membersRef.current!.length) {
      setMembers(m);
    }
  }, [JSON.stringify(props.value)]);

  const handleAdd = React.useCallback(() => {
    const m = members.concat();
    m.push({
      key: guid(),
      name: '',
      invalid: true,
      nameMutable: true
    });
    setMembers(m);
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

  return (
    <>
      {collapsable ? (
        <a
          className={cx('JSONSchemaObject-caret', {
            'is-collapsed': collapsed
          })}
          onClick={toggleCollapsed}
        >
          <Icon icon="caret" className="icon" />
        </a>
      ) : null}

      <div
        className={cx('JSONSchemaObject', {
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
                <div className={cx('JSONSchemaMember-key')}>
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
                            hasError={member.invalid}
                            onChange={onMemberKeyChange.bind(null, member)}
                            clearable={false}
                            placeholder={__('JSONSchema.key')}
                            options={filtedOptions}
                          />
                        ) : (
                          <Select
                            simpleValue
                            block
                            value={member.name}
                            hasError={member.invalid}
                            onChange={onMemberKeyChange.bind(null, member)}
                            clearable={false}
                            placeholder={__('JSONSchema.key')}
                            options={filtedOptions}
                          />
                        )
                      ) : (
                        <InputBox
                          value={member.name}
                          hasError={member.invalid}
                          onChange={onMemberKeyChange.bind(null, member)}
                          clearable={false}
                          placeholder={__('JSONSchema.key')}
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
            {__('JSONSchema.add_prop')}
          </Button>
        ) : null}
      </div>
    </>
  );
}
