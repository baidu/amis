/**
 * 后续好多地方可能都要支持 action，所以提取公共功能
 */

import {RendererProps} from '../factory';
import {ActionSchema, AjaxActionSchema} from '../renderers/Action';
import {normalizeApi, str2function} from './api';

export default function handleAction(
  e: React.MouseEvent<any>,
  action: ActionSchema,
  props: RendererProps,
  data?: any
) {
  // https://reactjs.org/docs/legacy-event-pooling.html
  e.persist(); // 等 react 17之后去掉 event pooling 了，这个应该就没用了

  const onAction = props.onAction;
  let onClick: any = action.onClick;

  if (typeof onClick === 'string') {
    onClick = str2function(onClick, 'event', 'props', 'data');
  }
  const result: any = onClick && onClick(e, props, data || props.data);

  if (e.isDefaultPrevented() || result === false || !onAction) {
    return;
  }

  e.preventDefault();

  // download 是一种 ajax 的简写
  if (action.actionType === 'download') {
    action.actionType = 'ajax';
    const api = normalizeApi((action as AjaxActionSchema).api);
    api.responseType = 'blob';
    (action as AjaxActionSchema).api = api;
  }

  onAction(e, action, data || props.data);
}
