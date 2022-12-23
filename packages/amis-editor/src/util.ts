import {
  BaseEventContext,
  RendererInfoResolveEventContext
} from 'amis-editor-core';

export function isCrudContext(
  ctx: BaseEventContext | RendererInfoResolveEventContext
) {
  return ['crud', 'crud2'].includes(
    ctx?.schema?.name ?? ctx?.schema?.$$editor?.rendere?.name
  );
}
