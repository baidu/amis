import {Renderer, RendererProps} from '../factory';
import React = require('react');
import Alert, {AlertProps} from '../components/Alert2';

@Renderer({
  test: /(^|\/)alert$/,
  name: 'alert'
})
export class TplRenderer extends React.Component<AlertProps & RendererProps> {
  render() {
    const {render, body, ...rest} = this.props;
    return <Alert {...rest}>{render('body', body)}</Alert>;
  }
}
