/**
 * @file AsyncLayer.tsx
 * @desc 异步加载层
 */
import React from 'react';
import {Spinner} from 'amis';

export interface AsyncLayerOptions {
  fallback?: React.ReactNode;
}

export const makeAsyncLayer = (
  schemaBuilderFn: () => Promise<any>,
  options?: AsyncLayerOptions
) => {
  const {fallback} = options || {};
  const LazyComponent = React.lazy(async () => {
    const schemaFormRender = await schemaBuilderFn();

    return {
      default: (...props: any[]) => <>{schemaFormRender(...props)}</>
    };
  });

  return (props: any) => (
    <React.Suspense
      fallback={
        fallback && React.isValidElement(fallback) ? (
          fallback
        ) : (
          <Spinner
            show
            overlay
            size="sm"
            tip="配置面板加载中"
            tipPlacement="bottom"
            className="flex"
          />
        )
      }
    >
      <LazyComponent {...props} />
    </React.Suspense>
  );
};
