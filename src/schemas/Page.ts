import {
  SchemaCollection,
  SchemaClassName,
  SchemaApi,
  SchemaExpression,
  SchemaName,
  SchemaDefaultData,
  BaseSchema
} from './Schema';
import {SchemaRemark} from './Remark';

/**
 * amis Page 渲染器。详情请见：https://baidu.gitee.io/amis/docs/components/page
 */
export interface PageSchema extends BaseSchema {
  /**
   * 指定为 page 渲染器。
   */
  type: 'page';

  /**
   * 页面标题
   */
  title?: string;

  /**
   * 页面副标题
   */
  subTitle?: string;

  /**
   * 页面描述, 标题旁边会出现个小图标，放上去会显示这个属性配置的内容。
   */
  remark?: SchemaRemark;

  /**
   * 内容区域
   */
  body?: SchemaCollection;

  /**
   * 内容区 css 类名
   */
  bodyClassName?: SchemaClassName;

  /**
   * 边栏区域
   */
  aside?: SchemaCollection;

  /**
   * 边栏区 css 类名
   */
  asideClassName?: SchemaClassName;

  /**
   * 配置容器 className
   */
  className?: SchemaClassName;

  data?: SchemaDefaultData;

  /**
   * 配置 header 容器 className
   */
  headerClassName?: SchemaClassName;

  /**
   * 页面初始化的时候，可以设置一个 API 让其取拉取，发送数据会携带当前 data 数据（包含地址栏参数），获取得数据会合并到 data 中，供组件内使用。
   */
  initApi?: SchemaApi;

  /**
   * 是否默认就拉取？
   */
  initFetch?: boolean;

  /**
   * 是否默认就拉取表达式
   */
  initFetchOn?: SchemaExpression;

  /**
   * 默认的消息提示信息，注意：如果接口返回了 msg 始终是接口返回的优先级更高。
   */
  messages?: {
    fetchFailed?: string;
    fetchSuccess?: string;
    saveFailed?: string;
    saveSuccess?: string;
  };

  name?: SchemaName;

  /**
   * 页面顶部区域，当存在 title 时在右上角显示。
   */
  toolbar?: SchemaCollection;

  /**
   * 配置 toolbar 容器 className
   */
  toolbarClassName?: SchemaClassName;

  definitions?: any; // todo

  /**
   * 配置轮询间隔，配置后 initApi 将轮询加载。
   */
  interval?: number;

  /**
   * 是否要静默加载，也就是说不显示进度
   */
  silentPolling?: boolean;

  /**
   * 配置停止轮询的条件。
   */
  stopAutoRefreshWhen?: SchemaExpression;
  // primaryField?: string, // 指定主键的字段名，默认为 `id`

  /**
   * 是否显示错误信息，默认是显示的。
   */
  showErrorMsg?: boolean;
}
