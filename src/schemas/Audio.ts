import {BaseSchema, SchemaCollection, SchemaUrlPath} from './Schema';

/**
 * Audio 音频渲染器，文档：https://baidu.gitee.io/amis/docs/components/audio
 */
export interface AudioSchema extends BaseSchema {
  /**
   * 指定为音频播放器
   */
  type: 'audio';

  /**
   * 是否是内联模式
   */
  inline: boolean;

  /**
   * "视频播放地址, 支持 $ 取变量。
   */
  src?: SchemaUrlPath;

  /**
   * 是否循环播放
   */
  loop?: boolean;

  /**
   * 是否自动播放
   */
  autoPlay?: boolean;

  /**
   * 配置可选播放倍速
   */
  rates?: Array<number>;

  /**
   * 可以配置控制器
   */
  controls?: Array<'rates' | 'play' | 'time' | 'process' | 'volume'>;
}
