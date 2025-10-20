declare module '*.dslpage.json?react' {
  import * as React from 'react';
  import {RootRendererProps} from 'amis';

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<RootRendererProps>
  >;

  export default ReactComponent;
}

declare module '*.amis.json?react' {
  import * as React from 'react';
  import {RootRendererProps} from 'amis';

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<RootRendererProps>
  >;

  export default ReactComponent;
}
