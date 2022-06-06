import {extendDefaultEnv} from 'amis-core';

import {alert, confirm, toast} from 'amis-ui';

extendDefaultEnv({
  alert,
  confirm,
  notify: (type: keyof typeof toast, msg: string, conf: any) =>
    toast[type] ? toast[type](msg, conf) : console.warn('[Notify]', type, msg)
});
