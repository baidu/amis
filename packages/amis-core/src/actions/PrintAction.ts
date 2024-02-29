import {printElements} from '../utils/printElement';
import {RendererEvent} from '../utils/renderer-event';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IPrintAction extends ListenerAction {
  actionType: 'copy';
  args: {
    testid?: string;
    testids?: string[];
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
    if (action.args?.testid) {
      const element = document.querySelector(
        `[data-testid='${action.args.testid}']`
      );
      if (element) {
        printElements([element]);
      }
    } else if (action.args?.testids) {
      const elements: Element[] = [];
      action.args.testids.forEach(testid => {
        const element = document.querySelector(`[data-testid='${testid}']`);
        if (element) {
          elements.push(element);
        }
      });
      printElements(elements);
    }
  }
}

registerAction('print', new PrintAction());
