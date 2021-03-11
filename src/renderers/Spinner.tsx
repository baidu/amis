import Spinner from '../components/Spinner';
import {Renderer, RendererProps} from '../factory';
import React from 'react';

interface SpinnerProps extends RendererProps {}

@Renderer({
  test: /(^|\/)spinner$/,
  name: 'spinner'
})
export class SpinnerRenderer extends React.Component<SpinnerProps> {
  render() {
    return <Spinner {...this.props} />;
  }
}
