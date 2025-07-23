import React from 'react';
import {getPropValue, FormControlProps, createObject} from 'amis-core';
import {ErrorBoundary} from 'amis-core';
import omit from 'lodash/omit';

function renderCommonStatic(props: any, defaultValue: string) {
  const {type, render, staticSchema} = props;
  const staticProps = {
    ...props,
    ...staticSchema,
    dispatchEvent: (eventName: string, data: any) => {
      // 不要透传 renderer， 因为这样 onEvent 就不是表单项那层的了
      return props.dispatchEvent(eventName, data);
    }
  };

  switch (type) {
    case 'select':
    case 'checkboxes':
    case 'button-group-select':
    case 'input-tree':
    case 'tree-select':
    case 'nested-select':
    case 'cascader-select':
    case 'radios':
    case 'multi-select':
    case 'transfer':
    case 'transfer-picker':
    case 'tabs-transfer':
    case 'tabs-transfer-picker':
    case 'picker':
      return render('static-select', {type: 'words'}, staticProps);

    case 'input-date':
    case 'input-datetime':
    case 'input-time':
    case 'input-month':
    case 'input-quarter':
    case 'input-year':
      return renderStaticDateTypes(staticProps);

    case 'input-date-range':
    case 'input-datetime-range':
    case 'input-time-range':
    case 'input-month-range':
    case 'input-quarter-range':
    case 'input-year-range':
      return render(
        'static-input-date-range',
        {type: 'date-range'},
        {
          ...props,
          valueFormat: props.format,
          format: props.inputFormat,
          ...staticSchema
        }
      );

    case 'input-password':
      return render('static-input-password', {type: 'password'}, staticProps);

    case 'input-color':
      return render('static-color', {type: 'color'}, staticProps);

    case 'input-tag':
      return render('static-input-tag', {type: 'tags'}, staticProps);

    case 'input-url':
      return render(
        'static-input-url',
        {type: 'link', href: defaultValue},
        staticProps
      );

    case 'input-number':
      return render(
        'static-input-number',
        {type: 'number'},
        {
          ...props,
          ...staticSchema
        }
      );

    default:
      return defaultValue;
  }
}

/**
 * 表单项类成员render支持静态展示装饰器
 */
let supportStatic = <T extends FormControlProps>() => {
  return function (
    target: any,
    name: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const props = (this as TypedPropertyDescriptor<any> & {props: T}).props;
      if (props.static) {
        const {
          render,
          staticSchema,
          classPrefix: ns,
          classnames: cx,
          className,
          placeholder,
          staticPlaceholder = <span className="text-muted">{'-'}</span>
        } = props;

        let body;
        const displayValue = getPropValue(
          props,
          undefined,
          props.canAccessSuperData ?? false
        );
        const isValueEmpty = displayValue == null || displayValue === '';

        if (
          staticSchema &&
          (staticSchema.type ||
            Array.isArray(staticSchema) ||
            typeof staticSchema === 'string' ||
            typeof staticSchema === 'number')
        ) {
          // 有自定义schema 且schema有type 时，展示schema
          body = render(
            [props.type || '', 'form-static-schema'].join('-'),
            staticSchema,
            {
              selectedOptions: props.selectedOptions,
              ...(props.selectedOptions
                ? {
                    data: createObject(
                      {
                        selectedItems: props.multiple
                          ? props.selectedOptions
                          : props.selectedOptions?.[0]
                      },
                      props.data
                    )
                  }
                : {})
            }
          );
        } else if (target.renderStatic) {
          // 特殊组件，control有 renderStatic 时，特殊处理
          body = target.renderStatic.apply(this, [
            ...args,
            isValueEmpty ? staticPlaceholder : displayValue
          ]);
        } else if (isValueEmpty) {
          // 空值时，展示 staticPlaceholder
          body = staticPlaceholder;
        } else {
          // 可复用组件 统一处理
          body = renderCommonStatic(props, displayValue);
        }

        return (
          <ErrorBoundary
            customErrorMsg={`拦截到${props.$schema.type}渲染错误`}
            fallback={() => {
              return (
                <div className="renderer-error-boundary">
                  {props.$schema?.type}
                  渲染发生错误，详细错误信息请查看控制台输出。
                </div>
              );
            }}
          >
            <div className={cx(`${ns}Form-static`, className)}>{body}</div>
          </ErrorBoundary>
        );
      }

      return original.apply(this, args);
    };
    return descriptor;
  };
};

function renderStaticDateTypes(props: any) {
  const {
    render,
    type,
    inputFormat,
    valueFormat,
    timeFormat,
    displayFormat,
    format,
    value
  } = props;
  return render('static-input-date', {
    type: 'date',
    value,
    format:
      type === 'time' && timeFormat ? timeFormat : displayFormat ?? inputFormat,
    valueFormat: valueFormat || format
  });
}

const overrideSupportStatic = (
  overrideFunc: () => (
    target: any,
    name: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => TypedPropertyDescriptor<any>
) => {
  supportStatic = overrideFunc;
};

export {supportStatic, overrideSupportStatic};
