import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, ApiObject, Action} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import cx from 'classnames';
import LazyComponent from '../components/LazyComponent';
import {resizeSensor} from '../utils/resize-sensor';
import {resolveVariableAndFilter, isPureVariable} from '../utils/tpl-builtin';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {ScopedContext, IScopedContext} from '../Scoped';
import {createObject} from '../utils/helper';
import Spinner from '../components/Spinner';
import {
  BaseSchema,
  SchemaApi,
  SchemaExpression,
  SchemaFunction,
  SchemaName,
  SchemaTokenizeableString
} from '../Schema';
import {ActionSchema} from './Action';

/**
 * Chart 图表渲染器。
 * 文档：https://baidu.gitee.io/amis/docs/components/carousel
 */
export interface ChartSchema extends BaseSchema {
  /**
   * 指定为 chart 类型
   */
  type: 'chart';

  /**
   * 图表配置接口
   */
  api?: SchemaApi;

  /**
   * 是否初始加载。
   * @deprecated 建议直接配置 api 的 sendOn
   */
  initFetch?: boolean;

  /**
   * 是否初始加载用表达式来配置
   * @deprecated 建议用 api.sendOn 属性。
   */
  initFetchOn?: SchemaExpression;

  /**
   * 配置echart的config
   */
  config?: any;

  /**
   * 宽度设置
   */
  width?: number;

  /**
   * 高度设置
   */
  height?: number;

  /**
   * 刷新时间
   */
  interval?: number;

  name?: SchemaName;

  /**
   * style样式
   */
  style?: {
    [propName: string]: any;
  };

  dataFilter?: SchemaFunction;

  source?: SchemaTokenizeableString;

  /**
   * 点击行为配置，可以用来满足下钻操作等。
   */
  clickAction?: ActionSchema;

  /**
   * 默认配置时追加的，如果更新配置想完全替换配置请配置为 true.
   */
  replaceChartOption?: boolean;

  /**
   * 不可见的时候隐藏
   */
  unMountOnHidden?: boolean;
}

/**
 * 深度查找具有某个 key 名字段的对象
 * @param obj
 * @param key
 */
function findObjectsWithKey(obj: any, key: string) {
  let objects: any[] = [];
  for (const k in obj) {
    if (!obj.hasOwnProperty(k)) continue;
    if (typeof obj[k] === 'object') {
      objects = objects.concat(findObjectsWithKey(obj[k], key));
    } else if (k === key) {
      objects.push(obj);
    }
  }
  return objects;
}

const EVAL_CACHE: {[key: string]: Function} = {};
/**
 * ECharts 中有些配置项可以写函数，但 JSON 中无法支持，为了实现这个功能，需要将看起来像函数的字符串转成函数类型
 * 目前 ECharts 中可能有函数的配置项有如下：interval、formatter、color、min、max、labelFormatter、pageFormatter、optionToContent、contentToOption、animationDelay、animationDurationUpdate、animationDelayUpdate、animationDuration、position、sort
 * 其中用得最多的是 formatter、sort，所以目前先只支持它们
 * @param config ECharts 配置
 */
function recoverFunctionType(config: object) {
  ['formatter', 'sort'].forEach((key: string) => {
    const objects = findObjectsWithKey(config, key);
    for (const object of objects) {
      const code = object[key];
      if (typeof code === 'string' && code.trim().startsWith('function ')) {
        try {
          if (!(code in EVAL_CACHE)) {
            EVAL_CACHE[code] = eval('(' + code + ')');
          }
          object[key] = EVAL_CACHE[code];
        } catch (e) {
          console.warn(code, e);
        }
      }
    }
  });
}

export interface ChartProps extends RendererProps, ChartSchema {
  chartRef?: (echart: any) => void;
  onDataFilter?: (config: any, echarts: any) => any;
  store: IServiceStore;
}
export class Chart extends React.Component<ChartProps> {
  static defaultProps: Partial<ChartProps> = {
    offsetY: 50,
    replaceChartOption: false,
    unMountOnHidden: true
  };

  static propsList: Array<string> = [];

  ref: any;
  echarts: any;
  unSensor: Function;
  pending?: object;
  timer: NodeJS.Timeout;
  mounted: boolean;
  reloadCancel?: Function;

  constructor(props: ChartProps) {
    super(props);

    this.refFn = this.refFn.bind(this);
    this.reload = this.reload.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    const {config, api, data, initFetch, source} = this.props;

    this.mounted = true;

    if (source && isPureVariable(source)) {
      const ret = resolveVariableAndFilter(source, data, '| raw');
      ret && this.renderChart(ret);
    } else if (api && initFetch !== false) {
      this.reload();
    }

    config && this.renderChart(config);
  }

  componentDidUpdate(prevProps: ChartProps) {
    const props = this.props;
    const api: string =
      (props.api && (props.api as ApiObject).url) || (props.api as string);

    if (isApiOutdated(prevProps.api, props.api, prevProps.data, props.data)) {
      this.reload();
    } else if (props.source && isPureVariable(props.source)) {
      const prevRet = prevProps.source
        ? resolveVariableAndFilter(prevProps.source, prevProps.data, '| raw')
        : null;
      const ret = resolveVariableAndFilter(props.source, props.data, '| raw');

      if (prevRet !== ret) {
        this.renderChart(ret || {});
      }
    } else if (props.config !== prevProps.config) {
      this.renderChart(props.config || {});
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
  }

  handleClick(ctx: object) {
    const {onAction, clickAction, data} = this.props;

    clickAction &&
      onAction &&
      onAction(null, clickAction, createObject(data, ctx));
  }

  refFn(ref: any) {
    const chartRef = this.props.chartRef;
    if (ref) {
      (require as any)(
        [
          'echarts',
          'echarts/extension/dataTool',
          'echarts/extension/bmap/bmap',
          'echarts/map/js/china',
          'echarts/map/js/world'
        ],
        (echarts: any, dataTool: any) => {
          (window as any).echarts = echarts;
          echarts.dataTool = dataTool;
          this.echarts = echarts.init(ref);
          this.echarts.on('click', this.handleClick);
          this.unSensor = resizeSensor(ref, () => {
            const width = ref.offsetWidth;
            const height = ref.offsetHeight;
            this.echarts.resize({
              width,
              height
            });
          });

          chartRef && chartRef(this.echarts);
          this.renderChart();
        }
      );
    } else {
      chartRef && chartRef(null);
      this.unSensor && this.unSensor();
    }

    this.ref = ref;
  }

  reload(subpath?: string, query?: any) {
    const {api, env, store, interval} = this.props;

    if (query) {
      return this.receive(query);
    } else if (!env || !env.fetcher || !isEffectiveApi(api, store.data)) {
      return;
    }

    clearTimeout(this.timer);
    if (this.reloadCancel) {
      this.reloadCancel();
      delete this.reloadCancel;
      this.echarts && this.echarts.hideLoading();
    }
    this.echarts && this.echarts.showLoading();

    env
      .fetcher(api, store.data, {
        cancelExecutor: (executor: Function) => (this.reloadCancel = executor)
      })
      .then(result => {
        if (!result.ok) {
          return env.notify(
            'error',
            result.msg || '加载失败，请重试！',
            result.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: result.msgTimeout
                }
              : undefined
          );
        }
        delete this.reloadCancel;
        this.renderChart(result.data || {});
        this.echarts && this.echarts.hideLoading();

        interval &&
          this.mounted &&
          (this.timer = setTimeout(this.reload, Math.max(interval, 3000)));
      })
      .catch(reason => {
        if (env.isCancel(reason)) {
          return;
        }

        env.notify('error', reason);
        this.echarts && this.echarts.hideLoading();
      });
  }

  receive(data: object) {
    const store = this.props.store;

    store.updateData(data);
    this.reload();
  }

  renderChart(config?: object) {
    config && (this.pending = config);
    if (!this.echarts) {
      return;
    }
    let onDataFilter = this.props.onDataFilter;
    const dataFilter = this.props.dataFilter;

    if (!onDataFilter && typeof dataFilter === 'string') {
      onDataFilter = new Function('config', 'echarts', dataFilter) as any;
    }

    config = config || this.pending;
    if (typeof config === 'string') {
      config = new Function('return ' + config)();
    }
    try {
      onDataFilter &&
        (config = onDataFilter(config, (window as any).echarts) || config);
    } catch (e) {
      console.warn(e);
    }

    if (config) {
      try {
        recoverFunctionType(config);
        this.echarts.setOption(config, this.props.replaceChartOption);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  render() {
    const {
      className,
      width,
      height,
      classPrefix: ns,
      unMountOnHidden
    } = this.props;
    let style = this.props.style || {};

    width && (style.width = width);
    height && (style.height = height);

    return (
      <LazyComponent
        unMountOnHidden={unMountOnHidden}
        placeholder={
          <div className={cx(`${ns}Chart`, className)} style={style}>
            <div className={`${ns}Chart-placeholder`}>
              <Spinner
                show
                icon="reload"
                spinnerClassName={cx('Chart-spinner')}
              />
            </div>
          </div>
        }
        component={() => (
          <div
            className={cx(`${ns}Chart`, className)}
            style={style}
            ref={this.refFn}
          />
        )}
      />
    );
  }
}

@Renderer({
  test: /(^|\/)chart$/,
  storeType: ServiceStore.name,
  name: 'chart'
})
export class ChartRenderer extends Chart {
  static contextType = ScopedContext;

  componentWillMount() {
    super.componentWillMount();
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
