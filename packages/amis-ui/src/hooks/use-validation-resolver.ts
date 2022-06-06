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

export function useValidationResolver(__ = (str: string) => str) {
  return React.useCallback<any>(
    async (values: any, context: any, config: any) => {
      const rules: any = {};
      const ruleKeys = Object.keys(validations);
      for (let key of Object.keys(config.fields)) {
        const field = config.fields[key];
        rules[key] = pick(field, ruleKeys);

        if (field.required) {
          rules[key].isRequired = true;
        }
      }

      const errors = validateObject(values, rules, undefined, __);

      return {
        values,
        errors: formatErrors(errors)
      };
    },
    [__]
  );
}

export default useValidationResolver;
