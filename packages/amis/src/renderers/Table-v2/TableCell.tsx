import {Renderer} from '../../factory';
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
}
