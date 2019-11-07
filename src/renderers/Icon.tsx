import React from 'react';
import {Renderer, RendererProps} from '../factory';

export interface IconProps extends RendererProps {
  icon: string;
}

export class Icon extends React.Component<IconProps, object> {
  static defaultProps: Partial<IconProps> = {
    icon: '',
    vendor: 'fa'
  };

  render() {
    const {icon, vendor, classnames: cx, className} = this.props;

    return (
      <i
        className={cx(
          vendor === 'iconfont'
            ? `iconfont icon-${icon}`
            : `${vendor} ${vendor}-${icon}`,
          className
        )}
      />
    );
  }
}

@Renderer({
  test: /(^|\/)icon$/,
  name: 'icon'
})
export class TplRenderer extends Icon {}
