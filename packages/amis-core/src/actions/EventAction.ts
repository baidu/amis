import {isExpression, resolveVariableAndFilterForAsync} from '../utils';
import {cloneObject, setVariable} from '../utils/object';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerContext,
  registerAction,
  ListenerAction
} from './Action';

export interface IEventAction extends ListenerAction {
  actionType: 'setEventData' | 'preventDefault' | 'stopPropagation';
  args: {
    key?: string;
    value?: any;
    [propName: string]: any;
  };
}

/**
 * 事件本身相关动作
 *
 * @export
 * @class EventAction
 * @implements {Action}
 */
export class EventAction implements RendererAction {
  async run(
    action: IEventAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    switch (action.actionType) {
      case 'setEventData':
        if (typeof action.args?.key === 'string') {
          const data = cloneObject(event.data);
          let value = action.args.value;

          if (isExpression(value)) {
            value = await resolveVariableAndFilterForAsync(
              value,
              event.data,
              '| raw'
            );
          }

          setVariable(data, action.args.key, value);
          event.setData(data);
        }
        break;
      case 'preventDefault':
        event.preventDefault();
        break;
      case 'stopPropagation':
        event.stopPropagation();
        break;
    }
  }
}

registerAction('setEventData', new EventAction());
registerAction('preventDefault', new EventAction());
registerAction('stopPropagation', new EventAction());
