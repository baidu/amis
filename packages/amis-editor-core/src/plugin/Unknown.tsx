import {registerEditorPlugin} from '../manager';
import {
  BasePlugin,
  BasicRendererInfo,
  PluginInterface,
  RendererInfoResolveEventContext
} from '../plugin';

export class UnkownRendererPlugin extends BasePlugin {
  static scene = ['layout'];
  order = 9999;

  getRendererInfo({
    renderer,
    schema,
    path
  }: RendererInfoResolveEventContext): BasicRendererInfo | void {
    if (schema.$$id && renderer) {
      // 有些就是不想做编辑器
      if (/(^|\/)static\-field/.test(path)) {
        return;
      } else if (
        renderer.name === 'card-item' ||
        renderer.name === 'list-item-field' ||
        renderer.name === 'card-item-field'
      ) {
        return;
      }

      // 复制部分信息出去
      return {
        name: 'Unknown',
        $schema: '/schemas/UnkownSchema.json'
      };
    }
  }
}

registerEditorPlugin(UnkownRendererPlugin);
