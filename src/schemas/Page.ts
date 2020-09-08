import {
  SchemaContainer,
  SchemaClassName,
  SchemaApi,
  SchemaExpression,
  SchemaName,
  SchemaDefaultData,
  SchemaSchema,
  BaseSchema
} from './Schema';

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
  remark?: string; // todo

  /**
   * 内容区域
   */
  body?: SchemaContainer;

  /**
   * 内容区 css 类名
   */
  bodyClassName?: SchemaClassName;

  /**
   * 边栏区域
   */
  aside?: SchemaContainer;

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

  messages?: {
    fetchFailed?: string;
    fetchSuccess?: string;
  };

  name?: SchemaName;

  /**
   * 页面顶部区域，当存在 title 时在右上角显示。
   */
  toolbar?: SchemaContainer;

  /**
   * 配置 toolbar 容器 className
   */
  toolbarClassName?: SchemaClassName;

  definitions?: any;
}
