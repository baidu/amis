import {Renderer} from 'amis-core';
import {TableCell} from '../Table';
import QuickEdit from '../QuickEdit';
import Copyable from '../Copyable';
import PopOverable from '../PopOver';

@Renderer({
  type: 'cell-field',
  name: 'cell-field'
})
@PopOverable()
@Copyable()
@QuickEdit()
export class CellFieldRenderer extends TableCell {
  static defaultProps = {
    ...TableCell.defaultProps,
    wrapperComponent: 'div'
  };

  // title 需要去掉，否则部分组件会将其渲染出来
  readonly propsNeedRemove: string[] = ['title'];
}
