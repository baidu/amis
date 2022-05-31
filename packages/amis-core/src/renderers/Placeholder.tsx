import React from 'react';
import {RendererProps} from '../factory';

export class Placeholder extends React.Component<RendererProps> {
  componentDidMount() {
    console.warn(`Please implement this renderer(${this.props.type})`);
  }

  render() {
    return null;
  }
}
