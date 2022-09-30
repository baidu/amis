import {registerEditorPlugin} from 'amis-editor-core';
import {BasePlugin} from 'amis-editor-core';
import {getSchemaTpl} from 'amis-editor-core';
import {JSONPipeOut} from 'amis-editor-core';
import {mockValue} from 'amis-editor-core';

export class VideoPlugin extends BasePlugin {
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

  panelTitle = '视频';
  panelBody = [
    getSchemaTpl('tabs', [
      {
        title: '常规',
        body: [
          {
            name: 'src',
            type: 'input-text',
            label: '视频地址',
            description:
              '可以写静态值，也可以用变量取比如：<code>\\${videoSrc}</code>'
          },

          {
            name: 'poster',
            type: 'input-text',
            label: '视频封面图片地址',
            description:
              '可以写静态值，也可以用变量取比如：<code>\\${videoPoster}</code>'
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
              type: 'remark',
              content: '如果是直播流，请勾选，否则有可能不能正常播放。'
            }
          })
        ]
      },
      {
        title: '外观',
        body: [
          {
            name: 'aspectRatio',
            label: '视频比例',
            type: 'button-group-select',
            size: 'sm',
            mode: 'inline',
            className: 'block',
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

          getSchemaTpl('switch', {
            name: 'splitPoster',
            label: '分开显示封面'
          }),

          getSchemaTpl('className')
        ]
      },
      {
        title: '显隐',
        body: [getSchemaTpl('visible')]
      },
      {
        title: '其他',
        body: [
          getSchemaTpl('ref'),
          {
            type: 'input-text',
            name: 'rates',
            label: '视频速率',
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

          {
            name: 'frames',
            type: 'input-text',
            label: '视频帧信息',
            description:
              '比如填写：<code>\\${videoFrames}</code>会在当前作用域中查找 videoFrames 变量，如果是对象，将生成视频截图列表，点击后可跳转到对应的帧。'
          }
        ]
      }
    ])
  ];

  filterProps(props: any) {
    props.frames = JSONPipeOut(props.frames);

    return props;
  }
}

registerEditorPlugin(VideoPlugin);
