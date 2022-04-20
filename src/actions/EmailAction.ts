import {RendererEvent} from '../utils/renderer-event';
import {filter} from '../utils/tpl';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import qs from 'qs';
import {
  RendererAction,
  ListenerAction,
  ListenerContext,
  registerAction
} from './Action';

export interface IEmailAction extends ListenerAction {
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
