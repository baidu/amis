declare module '*.dslpage.json?react' {
  import * as React from 'react';
  import {RootRendererProps, AMISSchema, AMISPageMeta} from 'amis';

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<RootRendererProps>
  >;

  export const schema: AMISSchema;
  export const meta: AMISPageMeta;

  export default ReactComponent;
}

declare module '*.amis.json?react' {
  import * as React from 'react';
  import {RootRendererProps, AMISSchema, AMISPageMeta} from 'amis';

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<RootRendererProps>
  >;

  export const schema: AMISSchema;
  export const meta: AMISPageMeta;

  export default ReactComponent;
}
