/**
 * Style 相关的操作
 */

import {IDataProvider} from './types/IDataProvider';

export class StyleSheet {
  dataProvider: IDataProvider;

  constructor(dataProvider: IDataProvider) {
    this.dataProvider = dataProvider;
  }
}
