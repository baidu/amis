import { __assign, __extends } from "tslib";
import { registerEditorPlugin } from 'amis-editor-core';
import { BasePlugin } from 'amis-editor-core';
import { getSchemaTpl } from 'amis-editor-core';
import { JSONPipeOut } from 'amis-editor-core';
import { mockValue } from 'amis-editor-core';
var VideoPlugin = /** @class */ (function (_super) {
    __extends(VideoPlugin, _super);
    function VideoPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 关联渲染器名字
        _this.rendererName = 'video';
        _this.$schema = '/schemas/VideoSchema.json';
        // 组件名称
        _this.name = '视频';
        _this.isBaseComponent = true;
        _this.description = '视频控件，可以用来播放各种视频文件，包括 flv 和 hls 格式。';
        _this.docLink = '/amis/zh-CN/components/video';
        _this.tags = ['功能'];
        _this.icon = 'fa fa-video-camera';
        _this.scaffold = {
            type: 'video',
            autoPlay: false,
            src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
            poster: mockValue({ type: 'image' })
        };
        _this.previewSchema = __assign({}, _this.scaffold);
        _this.panelTitle = '视频';
        _this.panelBody = [
            getSchemaTpl('tabs', [
                {
                    title: '常规',
                    body: [
                        {
                            name: 'src',
                            type: 'input-text',
                            label: '视频地址',
                            description: '可以写静态值，也可以用变量取比如：<code>\\${videoSrc}</code>'
                        },
                        {
                            name: 'poster',
                            type: 'input-text',
                            label: '视频封面图片地址',
                            description: '可以写静态值，也可以用变量取比如：<code>\\${videoPoster}</code>'
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
                            description: '如果是直播流，请勾选，否则有可能不能正常播放。'
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
                            options: [0.5, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(function (item) { return ({
                                label: item,
                                value: item
                            }); })
                        },
                        {
                            name: 'frames',
                            type: 'input-text',
                            label: '视频帧信息',
                            description: '比如填写：<code>\\${videoFrames}</code>会在当前作用域中查找 videoFrames 变量，如果是对象，将生成视频截图列表，点击后可跳转到对应的帧。'
                        }
                    ]
                }
            ])
        ];
        return _this;
    }
    VideoPlugin.prototype.filterProps = function (props) {
        props.frames = JSONPipeOut(props.frames);
        return props;
    };
    return VideoPlugin;
}(BasePlugin));
export { VideoPlugin };
registerEditorPlugin(VideoPlugin);
