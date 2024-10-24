import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptActionSelect} from './helper';

registerActionPanel('component', {
  label: '组件特性动作',
  tag: '组件',
  description: '触发所选组件的特性动作',
  supportComponents: '*',
  schema: () => renderCmptActionSelect('目标组件', true)
});
