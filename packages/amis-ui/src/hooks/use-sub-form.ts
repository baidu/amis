import {useCallback, useState} from 'react';
import isFunction from 'lodash/isFunction';
import {TranslateFn} from 'amis-core';
import {useForm, UseFormReturn} from 'react-hook-form';
import debounce from 'lodash/debounce';
import React from 'react';
import useValidationResolver from './use-validation-resolver';

const useSubForm = (
  defaultValue: any,
  translate: TranslateFn,
  onUpdate: (data: any) => void
): UseFormReturn => {
  const methods = useForm({
    defaultValues: defaultValue,
    mode: 'onChange', // 每次修改都验证
    shouldUnregister: true,
    resolver: useValidationResolver(translate)
  });

  // 数据修改后，自动提交更新到上层
  const lazyUpdate = React.useRef(
    debounce(onUpdate, 250, {
      leading: false,
      trailing: true
    })
  );

  // 销毁的时候要 cancel
  React.useEffect(() => {
    return () => lazyUpdate.current.cancel();
  }, []);

  // 监控数值变化，自动同步到上层
  React.useEffect(() => {
    const subscriber = methods.watch((data: any) => {
      lazyUpdate.current(data);
    });
    return () => subscriber.unsubscribe();
  }, [methods.watch]);

  return methods;
};

export default useSubForm;
