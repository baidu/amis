import {RendererEvent} from '../utils/renderer-event';
import {dataMapping} from '../utils/tpl-builtin';
import {filter} from '../utils/tpl';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import qs from 'qs';
import {
  Action,
  ListenerAction,
  ListenerContext,
  LoopStatus,
  registerAction
} from './Action';
import {isVisible} from '../utils/helper';

/**
 * 复制动作
 *
 * @export
 * @class CopyAction
 * @implements {Action}
 */
export class CopyAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    if (action.content || action.copy) {
      renderer.props.env.copy?.(
        filter(action.content || action.copy, action.args, '| raw'),
        {
          format: action.copyFormat
        }
      );
    }
  }
}

registerAction('copy', new CopyAction());
