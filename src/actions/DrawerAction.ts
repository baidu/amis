import {registerAction} from './Action';
import {CloseDialogAction, DialogAction} from './DialogAction';

/**
 * 打开抽屉动作
 *
 * @export
 * @class DrawerAction
 * @extends {DialogAction}
 */
export class DrawerAction extends DialogAction {}

/**
 * 关闭抽屉动作
 *
 * @export
 * @class CloseDrawerAction
 * @extends {CloseDialogAction}
 */
export class CloseDrawerAction extends CloseDialogAction {}

registerAction('drawer', new DrawerAction());
registerAction('closeDrawer', new CloseDrawerAction());
