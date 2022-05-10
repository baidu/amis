import React from 'react';
import {guid} from '../../utils/helper';
import Button from '../Button';
import {Icon} from '../icons';
import type {InputJSONSchemaItemProps} from './index';
import {InputJSONSchemaItem} from './Item';

type JSONSchemaArrayMember = {
  key: string;
  index: number;
  schema?: any;
  invalid?: boolean;
};
export function InputJSONSchemaArray(props: InputJSONSchemaItemProps) {
  const {
    classnames: cx,
    value,
    onChange,
    disabled,
    translate: __,
    renderKey,
    collapsable
  } = props;
  const buildMembers = React.useCallback((schema: any, value) => {
    const members: Array<JSONSchemaArrayMember> = [];

    let len = Array.isArray(value) ? value.length : 1;

    if (typeof schema.minContains === 'number') {
      len = Math.max(len, schema.minContains);
    }

    const maxContains =
      typeof schema.maxContains === 'number' ? schema.maxContains : 0;

    while (len--) {
      members.push({
        key: guid(),
        index: members.length,
        schema: schema.items,
        invalid: maxContains ? maxContains < members.length : false
      });
    }

    return members;
  }, []);

  const [members, setMembers] = React.useState<Array<JSONSchemaArrayMember>>(
    buildMembers(props.schema, value)
  );

  const membersRef = React.useRef(members);
  membersRef.current = members;

  const [collapsed, setCollapsed] = React.useState<boolean>(
    collapsable ? true : false
  );
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onMemberChange = (member: JSONSchemaArrayMember, memberValue: any) => {
    const newValue = Array.isArray(props.value) ? props.value.concat() : [];
    newValue[member.index] = memberValue;
    onChange?.(newValue);
  };
  const onMemberDelete = (member: JSONSchemaArrayMember) => {
    const idx = members.indexOf(member);
    if (!~idx) {
      throw new Error('member object not found');
    }

    const m = members.concat();
    m.splice(idx, 1);
    setMembers(m);

    const newValue = Array.isArray(props.value) ? props.value.concat() : [];
    newValue.splice(member.index, 1);
    onChange?.(newValue);
  };

  React.useEffect(() => {
    setMembers(buildMembers(props.schema, props.value));
  }, [props.schema]);

  React.useEffect(() => {
    const value = props.value;
    const schema = props.schema;
    let len = Array.isArray(value) ? value.length : 1;

    if (typeof schema.minContains === 'number') {
      len = Math.max(len, schema.minContains);
    }

    if (typeof schema.maxContains === 'number') {
      len = Math.min(schema.maxContains, len);
    }
    const m = membersRef.current!.concat();

    if (m.length !== len) {
      while (m.length !== len) {
        if (m.length > len) {
          m.pop();
        } else {
          m.push({
            key: guid(),
            index: m.length,
            schema: schema.items
          });
        }
      }
      setMembers(m);
    }
  }, [props.value]);

  const handleAdd = React.useCallback(() => {
    const m = members.concat();
    m.push({
      key: guid(),
      index: members.length,
      schema: props.schema.items,
      invalid: false
    });
    setMembers(m);
  }, [members]);

  const maxContains =
    typeof props.schema?.maxContains === 'number'
      ? props.schema.maxContains
      : 0;

  const minContains =
    typeof props.schema?.minContains === 'number'
      ? props.schema.minContains
      : 0;

  // todo additionalProperties 还有其他格式
  const allowAdd = !maxContains || maxContains > members.length;
  const allowDelete = !minContains || minContains < members.length;

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
          <InputJSONSchemaItem
            {...props}
            value={value}
            onChange={onChange}
            schema={{
              type: 'string'
            }}
            placeholder={props.schema?.description}
          />
        ) : (
          members.map(member => {
            return (
              <div key={member.key} className={cx('JSONSchemaMember')}>
                <div className={cx('JSONSchemaMember-value')}>
                  <InputJSONSchemaItem
                    {...props}
                    value={value?.[member.index]}
                    onChange={onMemberChange.bind(null, member)}
                    schema={
                      member.schema || {
                        type: 'string'
                      }
                    }
                    collapsable
                  />
                </div>
                {allowDelete ? (
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

        {!collapsed ? (
          <Button
            level="link"
            onClick={handleAdd}
            size="xs"
            disabled={disabled || !allowAdd}
          >
            {__('JSONSchema.add_prop')}
          </Button>
        ) : null}
      </div>
    </>
  );
}
