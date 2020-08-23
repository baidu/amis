import {OptionsControlProps, OptionsControl} from './Options';
import React from 'react';
import {Api} from '../../types';
import Spinner from '../../components/Spinner';
import {BaseTransferRenderer} from './Transfer';
import TabsTransfer from '../../components/TabsTransfer';

export interface TabsTransferProps extends OptionsControlProps {
  showArrow?: boolean;
  sortable?: boolean;
  searchResultMode?: 'table' | 'list' | 'tree' | 'chained';
  searchable?: boolean;
  searchApi?: Api;
}

@OptionsControl({
  type: 'tabs-transfer'
})
export class TabsTransferRenderer extends BaseTransferRenderer<
  TabsTransferProps
> {
  render() {
    const {
      className,
      classnames: cx,
      options,
      selectedOptions,
      sortable,
      loading,
      searchable,
      searchResultMode,
      showArrow,
      deferLoad
    } = this.props;

    return (
      <div className={cx('TabsTransferControl', className)}>
        <TabsTransfer
          value={selectedOptions}
          options={options}
          onChange={this.handleChange}
          option2value={this.option2value}
          sortable={sortable}
          searchResultMode={searchResultMode}
          onSearch={searchable ? this.handleSearch : undefined}
          showArrow={showArrow}
          onDeferLoad={deferLoad}
        />

        <Spinner overlay key="info" show={loading} />
      </div>
    );
  }
}
