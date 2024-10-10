import {printElements} from '../utils/printElement';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IPrintAction extends ListenerAction {
  actionType: 'print';
  args: {
    id?: string;
    ids?: string[];
  };
}

/**
 * 打印动作
 *
 * @export
 * @class PrintAction
 * @implements {Action}
 */
export class PrintAction implements RendererAction {
  async run(
    action: IPrintAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    // 兼容之前的 word 打印
    if (action.componentId) {
      const targetComponent = event.context.scoped?.getComponentById(
        action.componentId
      );
      targetComponent?.doAction?.(action, event.data, true, action.args);
      return;
    }

    if (action.args?.id) {
      const element = document.querySelector(`[data-id='${action.args.id}']`);
      if (element) {
        printElements([element]);
      }
    } else if (action.args?.ids) {
      const elements: Element[] = [];
      action.args.ids.forEach(id => {
        const element = document.querySelector(`[data-id='${id}']`);
        if (element) {
          elements.push(element);
        }
      });
      printElements(elements);
    }
  }
}

registerAction('print', new PrintAction());
