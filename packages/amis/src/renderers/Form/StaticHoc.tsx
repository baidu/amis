import React from "react";
import {getPropValue, FormControlProps} from "amis-core";

export interface renderStaticHocProps {
  /**
   * 展示态时，是否去掉paddingY
   * 大多数都需要，个别表单项不需要
   */
  staticNoPaddingY?: boolean;
}

/**
 * 表单项目类成员展示态装饰器
 */
export default function renderStaticHoc<T extends FormControlProps>(
  hocProps:renderStaticHocProps = {
    staticNoPaddingY: false
  }
) {
  const {staticNoPaddingY} = hocProps;
  return function (
    target: any,
    name: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const props = (this as TypedPropertyDescriptor<any> & {props: T}).props;
      const {
        staticSchema,
        render,
        classPrefix: ns,
        classnames: cx,
        staticPlaceholder = '-'
      } = props;

      const displayValue = getPropValue(props) || staticPlaceholder;
      const body = staticSchema
        // 外部传入自定义展示态schema
        ? render('form-static-schema', staticSchema, props)
        // 预置展示态
        : original.apply(this, [...args, displayValue]);

      return <div className={cx(`${ns}Form-static`, {
        'is-noPaddingY-static': staticNoPaddingY
      })}>
        {body}
      </div>
    }
    return descriptor;
  }
}
