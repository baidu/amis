import React from 'react';
import {themeable, ClassNamesFn} from '../../theme';
import FormItem, {FormControlProps} from './Item';
import LocationPicker from '../../components/LocationPicker';

export interface LocationControlProps extends FormControlProps {
  vendor: 'baidu' | 'gaode' | 'tenxun';
  value: any;
  ak: string;
  onChange: (value: any) => void;
  classnames: ClassNamesFn;
  classPrefix: string;
}

export class LocationControl extends React.Component<LocationControlProps> {
  static defaultProps = {
    vendor: 'baidu'
  };

  render() {
    return (
      <div className={this.props.classnames('LocationControl')}>
        <LocationPicker {...this.props} />
      </div>
    );
  }
}

@FormItem({
  type: 'location'
})
export class LocationRenderer extends LocationControl {}
