import {IRootStore} from '../store/root';
import {isVisible} from '../utils/helper';
import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

/**
 * 发送请求动作
 *
 * @export
 * @class AjaxAction
 * @implements {Action}
 */
export class AjaxAction implements Action {
  async run(
    action: ListenerAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    const store = renderer.props.store;

    store.setCurrentAction(action);
    store
      .saveRemote(action.api as string, action.args, {
        successMessage: action.messages && action.messages.success,
        errorMessage: action.messages && action.messages.failed
      })
      .then(async () => {
        if (action.feedback && isVisible(action.feedback, store.data)) {
          await this.openFeedback(action.feedback, store);
        }

        const redirect = action.redirect && filter(action.redirect, store.data);
        redirect && renderer.env.jumpTo(redirect, action);
      })
      .catch(() => {});
  }

  openFeedback(dialog: any, store: IRootStore) {
    return new Promise(resolve => {
      store.setCurrentAction({
        type: 'button',
        actionType: 'dialog',
        dialog: dialog
      });
      store.openDialog(store.data, undefined, confirmed => {
        resolve(confirmed);
      });
    });
  }
}

registerAction('ajax', new AjaxAction());
