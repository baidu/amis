/**
 * 兼容 1.x 里面的注册渲染器的方法。
 */
import {EditorManager, registerEditorPlugin} from './manager';
import {BasePlugin} from './plugin';

/**
 * 旧版本注册渲染器编辑器的方法。
 *
 * @deprecated
 * @param rendererName
 * @param config
 */
export function RendererEditor(
  rendererName: string,
  config: {
    name: string;
    description?: string;
    type?: string;
    previewSchema?: any;
    scaffold?: any;
  }
) {
  return function (Klass: new (manager: EditorManager) => BasicEditor) {
    registerEditorPlugin(
      class ComposedPlugin extends Klass {
        rendererName: string;
        name: string;
        description?: string;
        scaffold?: any;
        previewSchema?: any;
        panelTitle?: string;
        panelControls?: Array<any>;

        constructor(manager: EditorManager) {
          super(manager);

          this.rendererName = rendererName;
          this.name = this.tipName || config.name;
          this.description = config.description;
          this.scaffold = config.scaffold || {type: config.type};
          this.previewSchema = config.previewSchema || this.scaffold;

          if (this.settingsSchema) {
            this.panelTitle = this.settingsSchema.title;
            this.panelControls = this.settingsSchema.body;
          }
        }
      }
    );
  };
}

/**
 * 为了兼容旧版的注册方法
 * @deprecated
 */
export class BasicEditor extends BasePlugin {
  tipName?: string;
  settingsSchema?: {
    title: string;
    body: Array<any>;
  };
}
