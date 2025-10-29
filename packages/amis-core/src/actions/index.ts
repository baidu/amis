/**
 * @file 导入所有动作
 */

import './LoopAction';
import './BreakAction';
import './ContinueAction';
import './SwitchAction';
import './ParallelAction';
import './CustomAction';
import './BroadcastAction';
import './CmptAction';
import './StatusAction';
import './AjaxAction';
import './CopyAction';
import './DialogAction';
import './DrawerAction';
import './EmailAction';
import './EventAction';
import './LinkAction';
import './ToastAction';
import './WaitAction';
import './PageAction';
import './PrintAction';

export * from './Action';

import {ILoopAction} from './LoopAction';
import {IBreakAction} from './BreakAction';
import {IContinueAction} from './ContinueAction';
import {IParallelAction} from './ParallelAction';
import {ISwitchAction} from './SwitchAction';
import {ICustomAction} from './CustomAction';
import {IBroadcastAction} from './BroadcastAction';
import {ICmptAction} from './CmptAction';
import {IStatusAction} from './StatusAction';
import {IAjaxAction} from './AjaxAction';
import {ICopyAction} from './CopyAction';
import {
  IDialogAction,
  IConfirmAction,
  IAlertAction,
  IConfirmDialogAction,
  ICloseDialogAction
} from './DialogAction';
import {IDrawerAction} from './DrawerAction';
import {IEmailAction} from './EmailAction';
import {IEventAction} from './EventAction';
import {ILinkAction} from './LinkAction';
import {IToastAction} from './ToastAction';
import {IWaitAction} from './WaitAction';
import {IPrintAction} from './PrintAction';
import {IPageGoAction} from './PageAction';
import {ICloseDrawerAction} from './DrawerAction';

declare module '../schema' {
  interface AMISActionRegistry {
    loop: ILoopAction;
    break: IBreakAction;
    continue: IContinueAction;
    parallel: IParallelAction;
    switch: ISwitchAction;
    custom: ICustomAction;
    broadcast: IBroadcastAction;
    setValue: ICmptAction;
    reload: ICmptAction;
    validateFormItem: ICmptAction;
    static: IStatusAction;
    nonstatic: IStatusAction;
    show: IStatusAction;
    visibility: IStatusAction;
    hidden: IStatusAction;
    enabled: IStatusAction;
    disabled: IStatusAction;
    usability: IStatusAction;
    ajax: IAjaxAction;
    download: IAjaxAction;
    copy: ICopyAction;
    dialog: IDialogAction;
    confirm: IConfirmAction;
    alert: IAlertAction;
    confirmDialog: IConfirmDialogAction;
    closeDialog: ICloseDialogAction;
    drawer: IDrawerAction;
    closeDrawer: ICloseDrawerAction;
    email: IEmailAction;
    setEventData: IEventAction;
    preventDefault: IEventAction;
    stopPropagation: IEventAction;
    link: ILinkAction;
    url: ILinkAction;
    jump: ILinkAction;
    toast: IToastAction;
    wait: IWaitAction;
    goBack: IPageGoAction;
    refresh: IPageGoAction;
    goPage: IPageGoAction;
    print: IPrintAction;
  }
}
