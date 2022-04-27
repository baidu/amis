import {Renderer} from '../../factory';
import ColumnToggler from '../Table/ColumnToggler';

@Renderer({
  type: 'column-toggler',
  name: 'column-toggler'
})
export class ColumnTogglerRenderer extends ColumnToggler {}
