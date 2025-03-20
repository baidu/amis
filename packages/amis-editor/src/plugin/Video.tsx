import {registerEditorPlugin, tipedLabel} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {JSONPipeOut} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';
import {RendererPluginEvent, BaseEventContext} from 'amis-editor-core';
import {getEventControlConfig} from '../renderer/event-control/helper';
export class VideoPlugin extends BasePlugin {
  static id = 'VideoPlugin';
  // 关联渲染器名字
  rendererName = 'video';
  $schema = '/schemas/VideoSchema.json';

  // 组件名称
  name = '视频';
  isBaseComponent = true;
  description = '视频控件，可以用来播放各种视频文件，包括 flv 和 hls 格式。';
  docLink = '/amis/zh-CN/components/video';
  tags = ['功能'];
  icon = 'fa fa-video-camera';
  pluginIcon = 'video-plugin';
  scaffold = {
    type: 'video',
    autoPlay: false,
    src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
    poster: mockValue({type: 'image'})
  };
  previewSchema = {
    ...this.scaffold
  };
  events: RendererPluginEvent[] = [
    {
      eventName: 'play',
      eventLabel: '开始播放',
      description: '视频播放时触发',
      dataSchema: []
    },
    {
      eventName: 'pause',
      eventLabel: '暂停播放',
      description: '视频暂停时触发',
      dataSchema: []
    },
    {
      eventName: 'ended',
      eventLabel: '播放结束',
      description: '视频播放结束时触发',
      dataSchema: []
    }
  ];
  panelTitle = '视频';
  panelJustify = true;
  panelBodyCreator = (context: BaseEventContext) => {
    return [
      getSchemaTpl('tabs', [
        {
          title: '属性',
          body: [
            getSchemaTpl('collapseGroup', [
              {
                title: '基本',
                body: [
                  getSchemaTpl('layout:originPosition', {value: 'left-top'}),
                  getSchemaTpl('formulaControl', {
                    name: 'src',
                    label: tipedLabel(
                      '视频地址',
                      '可以写静态值，也可以用变量取比如：<code>\\${videoSrc}</code>'
                    ),
                    placeholder: '请输入视频地址'
                  }),
                  getSchemaTpl('formulaControl', {
                    name: 'poster',
                    label: tipedLabel(
                      '视频封面',
                      '可以写静态值，也可以用变量取比如：<code>\\${videoPoster}</code>'
                    ),
                    placeholder: '请输入视频封面地址'
                  }),
                  {
                    name: 'aspectRatio',
                    label: '视频比例',
                    type: 'button-group-select',
                    size: 'sm',

                    value: 'auto',
                    options: [
                      {
                        label: '自动',
                        value: 'auto'
                      },
                      {
                        label: '4:3',
                        value: '4:3'
                      },
                      {
                        label: '16:9',
                        value: '16:9'
                      }
                    ]
                  },
                  {
                    type: 'input-text',
                    name: 'rates',
                    label: '播放速率',
                    multiple: true,
                    joinValues: false,
                    extractValue: true,
                    options: [0.5, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(
                      item => ({
                        label: item,
                        value: item
                      })
                    )
                  },
                  getSchemaTpl('switch', {
                    name: 'autoPlay',
                    label: '自动播放'
                  }),

                  getSchemaTpl('switch', {
                    name: 'muted',
                    label: '静音'
                  }),

                  getSchemaTpl('switch', {
                    name: 'isLive',
                    label: '直播流',
                    labelRemark: {
                      className: 'm-l-xs',
                      trigger: 'click',
                      rootClose: true,
                      placement: 'left',
                      content: '如果是直播流，请勾选，否则有可能不能正常播放。'
                    }
                  }),
                  getSchemaTpl('formulaControl', {
                    name: 'frame',
                    label: '视频帧',
                    placeholder: ''
                  })
                ]
              }
            ])
          ]
        },
        {
          title: '外观',
          body: getSchemaTpl('collapseGroup', [
            {
              ...getSchemaTpl('theme:base', {
                hideBackground: true
              }),
              body: [
                // 原有的状态选择器
                ...getSchemaTpl('theme:base', {hideBackground: true}).body,
                // 将宽度配置插入到状态选择器下面
                getSchemaTpl('theme:select', {
                  label: '宽度',
                  name: 'themeCss.baseControlClassName.width'
                })
              ]
            },
            getSchemaTpl('animation', {
              label: '动画',
              name: 'themeCss.baseControlClassName.animation'
            })
          ])
        },
        {
          title: '事件',
          className: 'p-none',
          body: [
            getSchemaTpl('eventControl', {
              name: 'onEvent',
              ...getEventControlConfig(this.manager, context)
            })
          ]
        }
        // {
        //   title: '其他',
        //   body: [
        //     getSchemaTpl('ref'),
        //     {
        //       type: 'input-text',
        //       name: 'rates',
        //       label: '视频速率',
        //       multiple: true,
        //       joinValues: false,
        //       extractValue: true,
        //       options: [0.5, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(
        //         item => ({
        //           label: item,
        //           value: item
        //         })
        //       )
        //     },

        //     {
        //       name: 'frames',
        //       type: 'input-text',
        //       label: '视频帧信息',
        //       description:
        //         '比如填写：<code>\\${videoFrames}</code>会在当前作用域中查找 videoFrames 变量，如果是对象，将生成视频截图列表，点击后可跳转到对应的帧。'
        //     }
        //   ]
        // }
      ])
    ];
  };

  filterProps(props: any) {
    props.frames = JSONPipeOut(props.frames);

    return props;
  }
}

registerEditorPlugin(VideoPlugin);
