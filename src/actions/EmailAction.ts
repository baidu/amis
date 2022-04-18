import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import qs from 'qs';
import {
  Action,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IEmailAction extends ListenerAction {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
}

/**
 * 邮件动作
 *
 * @export
 * @class EmailAction
 * @implements {Action}
 */
export class EmailAction implements Action {
  async run(
    action: IEmailAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    const mailTo = filter(action.to, action.args);
    const mailInfo = mapValues(
      pick(action, 'cc', 'bcc', 'subject', 'body'),
      val => filter(val, action.args)
    );
    const mailStr = qs.stringify(mailInfo);
    const mailto = `mailto:${mailTo}?${mailStr}`;

    window.open(mailto);
  }
}

registerAction('email', new EmailAction());
