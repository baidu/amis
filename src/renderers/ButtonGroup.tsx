import React from 'react';
import ButtonGroup from './Form/ButtonGroup';
import {Renderer} from '../factory';

export default ButtonGroup;

@Renderer({
  test: /(^|\/)(?:button|action)\-group$/,
  name: 'button-group'
})
export class ButtonGroupRenderer extends ButtonGroup {}
