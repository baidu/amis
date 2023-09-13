import {RendererEvent} from '../utils/renderer-event';
import pick from 'lodash/pick';
import qs from 'qs';
import {
  RendererAction,
  ListenerContext,
  registerAction,
  ListenerAction
} from './Action';

export interface IEmailAction extends ListenerAction {
  actionType: 'email';
  args: {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    body: string;
    [propName: string]: any;
  };
}

/**
 * 邮件动作
 *
 * @export
 * @class EmailAction
 * @implements {Action}
 */
export class EmailAction implements RendererAction {
  async run(
    action: IEmailAction,
    renderer: ListenerContext,
    event: RendererEvent<any>
  ) {
    const mailTo = action.args?.to;
    const mailInfo = pick(action.args ?? {}, 'cc', 'bcc', 'subject', 'body');
    const mailStr = qs.stringify(mailInfo);
    const mailto = `mailto:${mailTo}?${mailStr}`;

    window.open(mailto);
  }
}

registerAction('email', new EmailAction());
