/**
 * @file 用 amis 内置的验证来验证 react-hook-form 里面的表单数据
 */
import pick from 'lodash/pick';
import React from 'react';
import {validateObject, validations} from 'amis-core';

function formatErrors(errors: any) {
  const formated: any = {};
  Object.keys(errors).forEach(key => {
    const origin = errors[key][0];
    if (origin) {
      formated[key] = {
        type: origin.rule,
        message: origin.msg
      };
    }
  });
  return formated;
}

export function useValidationResolver(
  __ = (str: string) => str,
  validate?: (
    error: {
      [propName: string]: {
        rule: string;
        msg: string;
      }[];
    },
    values: Record<string, any>,
    context: any,
    config: any
  ) => Promise<void>
) {
  return React.useCallback<any>(
    async (values: any, context: any, config: any) => {
      const rules: any = {};
      const customValidator: any = {};
      const ruleKeys = Object.keys(validations);
      for (let key of Object.keys(config.fields)) {
        const field = config.fields[key];
        rules[key] = pick(field, ruleKeys);

        if (field.required) {
          rules[key].isRequired = true;
        }

        if (typeof field.validate === 'function') {
          customValidator[key] = field.validate;
        }
      }

      const errors = validateObject(values, rules, undefined, __);

      for (let key of Object.keys(customValidator)) {
        const validate = customValidator[key];
        const result = await validate(values[key]);

        if (typeof result === 'string') {
          errors[key] = errors[key] || [];
          errors[key].push({
            rule: 'custom',
            msg: result
          });
        }
      }

      try {
        await validate?.(errors, values, context, config);
      } catch (e) {
        errors.customValidate = [
          {
            rule: 'custom',
            msg: e.message || e
          }
        ];
      }

      return {
        values,
        errors: formatErrors(errors)
      };
    },
    [__, validate]
  );
}

export default useValidationResolver;
