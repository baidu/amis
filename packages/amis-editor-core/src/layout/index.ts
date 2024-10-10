import {EditorNodeType} from '../store/node';
import {JSONGetById} from '../util';
import DefaultLayout from './default';
import FlexLayout from './flex';
import {LayoutInterface} from './interface';

export default function getLayoutInstance(
  schema: any,
  region: EditorNodeType
): LayoutInterface {
  if (!region) {
    return new DefaultLayout();
  }
  const mode = region?.regionInfo?.dndMode;
  const regionNode = JSONGetById(schema, region?.id);
  let Klass = DefaultLayout;
  if (typeof mode === 'function') {
    if (mode(regionNode) === 'flex') {
      Klass = FlexLayout;
    }
  }

  return new Klass();
}
