import {registerEditorPlugin} from '../manager';
import {BaseEventContext, BasePlugin} from '../plugin';
import {defaultValue, getSchemaTpl} from '../component/schemaTpl';

export class AudioPlugin extends BasePlugin {
  // 关联渲染器名字
  rendererName = 'audio';
  $schema = '/schemas/AudioSchema.json';

  // 组件名称
  name = '音频';
  isBaseComponent = true;
  description = '音频控件，可以用来播放各种音频文件。';
  tags = ['功能'];
  icon = 'fa fa-music';
  scaffold = {
    type: 'audio',
    autoPlay: false,
    src: ''
  };
  previewSchema = {
    ...this.scaffold
  };

  panelTitle = '音频';
  panelBodyCreator = (context: BaseEventContext) => {
    const isUnderField = /\/field\/\w+$/.test(context.path as string);
    return [
      getSchemaTpl('tabs', [
        {
          title: '常规',
          body: [
            isUnderField
              ? {
                  type: 'tpl',
                  inline: false,
                  className: 'text-info text-sm',
                  tpl: '<p>当前为字段内容节点配置，选择上层还有更多的配置。</p>'
                }
              : null,
            {
              name: 'src',
              type: 'input-text',
              label: '音频地址',
              description: '支持获取变量如：<code>\\${audioSrc}</code>'
            },
            {
              type: 'select',
              name: 'rates',
              label: '音频倍速',
              description: '加速范围在0.1到16之间',
              multiple: true,
              pipeIn: (value: any) =>
                Array.isArray(value) ? value.join(',') : [],
              pipeOut: (value: any) => {
                if (value && value.length) {
                  let rates = value.split(',');
                  rates = rates
                    .filter(
                      (x: string | number) =>
                        Number(x) && Number(x) > 0 && Number(x) <= 16
                    )
                    .map((x: string | number) => Number(Number(x).toFixed(1)));
                  return Array.from(new Set(rates));
                } else {
                  return [];
                }
              },
              options: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4']
            },
            {
              name: 'controls',
              type: 'select',
              label: '内部控件',
              multiple: true,
              extractValue: true,
              joinValues: false,
              options: [
                {
                  label: '倍速',
                  value: 'rates'
                },
                {
                  label: '播放',
                  value: 'play'
                },
                {
                  label: '时间',
                  value: 'time'
                },
                {
                  label: '进度',
                  value: 'process'
                },
                {
                  label: '音量',
                  value: 'volume'
                }
              ],
              pipeIn: defaultValue([
                'rates',
                'play',
                'time',
                'process',
                'volume'
              ]),
              labelRemark: {
                trigger: 'click',
                className: 'm-l-xs',
                rootClose: true,
                content: '选择倍速后，还需要在常规选择栏中配置倍速',
                placement: 'left'
              }
            },

            getSchemaTpl('switch', {
              name: 'autoPlay',
              label: '自动播放'
            }),

            getSchemaTpl('switch', {
              name: 'loop',
              label: '循环播放'
            })
          ]
        },
        {
          title: '外观',
          body: [
            getSchemaTpl('className'),

            getSchemaTpl('switch', {
              name: 'inline',
              label: '内联模式',
              pipeIn: defaultValue(true)
            })
          ]
        },
        {
          title: '显隐',
          body: [getSchemaTpl('ref'), getSchemaTpl('visible')]
        }
      ])
    ];
  };
}

registerEditorPlugin(AudioPlugin);
