import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {Api, ApiObject, Action} from '../types';
import {filter, evalExpression} from '../utils/tpl';
import cx from 'classnames';
import LazyComponent from '../components/LazyComponent';
import {resizeSensor} from '../utils/resize-sensor';
import {
  resolveVariableAndFilter,
  isPureVariable,
  dataMapping
} from '../utils/tpl-builtin';
import {isApiOutdated, isEffectiveApi} from '../utils/api';
import {ScopedContext, IScopedContext} from '../Scoped';
import {createObject, findObjectsWithKey} from '../utils/helper';
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
import {isAlive} from 'mobx-state-tree';

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
   * Chart 主题配置
   */
  chartTheme?: any;

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
   * 配置echart的config，支持数据映射。如果用了数据映射，为了同步更新，请设置 trackExpression
   */
  config?: any;

  /**
   * 跟踪表达式，如果这个表达式的运行结果发生变化了，则会更新 Echart，当 config 中用了数据映射时有用。
   */
  trackExpression?: string;

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
   * 默认开启 Config 中的数据映射，如果想关闭，请开启此功能。
   */
  disableDataMapping?: boolean;

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
      if (typeof code === 'string' && code.trim().startsWith('function')) {
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

export interface ChartProps extends RendererProps, Omit<ChartSchema, 'type'> {
  chartRef?: (echart: any) => void;
  onDataFilter?: (config: any, echarts: any) => any;
  onChartWillMount?: (echarts: any) => void | Promise<void>;
  onChartMount?: (chart: echarts.ECharts, echarts: any) => void;
  onChartUnMount?: (chart: echarts.ECharts, echarts: any) => void;
  store: IServiceStore;
}
export class Chart extends React.Component<ChartProps> {
  static defaultProps: Partial<ChartProps> = {
    replaceChartOption: false,
    unMountOnHidden: false
  };

  static propsList: Array<string> = [];

  ref: any;
  echarts?: echarts.ECharts;
  unSensor: Function;
  pending?: object;
  pendingCtx?: any;
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
    } else if (
      props.config &&
      props.trackExpression &&
      filter(props.trackExpression, props.data) !==
        filter(prevProps.trackExpression, prevProps.data)
    ) {
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
    const {
      chartTheme,
      onChartWillMount,
      onChartMount,
      onChartUnMount
    } = this.props;

    if (ref) {
      Promise.all([
        import('echarts'),
        import('echarts/extension/dataTool'),
        import('echarts/extension/bmap/bmap')
      ]).then(async ([echarts]) => {
        (window as any).echarts = echarts;
        let theme = 'default';

        if (chartTheme) {
          echarts.registerTheme('custom', chartTheme);
          theme = 'custom';
        }

        if (onChartWillMount) {
          await onChartWillMount(echarts);
        }

        this.echarts = echarts.init(ref, theme);
        onChartMount?.(this.echarts, echarts);
        this.echarts.on('click', this.handleClick);
        this.unSensor = resizeSensor(ref, () => {
          const width = ref.offsetWidth;
          const height = ref.offsetHeight;
          this.echarts?.resize({
            width,
            height
          });
        });

        chartRef && chartRef(this.echarts);
        this.renderChart();
      });
    } else {
      chartRef && chartRef(null);
      this.unSensor && this.unSensor();

      if (this.echarts) {
        onChartUnMount?.(this.echarts, (window as any).echarts);
        this.echarts.dispose();
        delete this.echarts;
      }
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
      this.echarts?.hideLoading();
    }
    this.echarts?.showLoading();

    store.markFetching(true);
    env
      .fetcher(api, store.data, {
        cancelExecutor: (executor: Function) => (this.reloadCancel = executor)
      })
      .then(result => {
        isAlive(store) && store.markFetching(false);

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

        const data = result.data || {};
        // 说明返回的是数据接口。
        if (!data.series && this.props.config) {
          const ctx = createObject(this.props.data, data);
          this.renderChart(this.props.config, ctx);
        } else {
          this.renderChart(result.data || {});
        }

        this.echarts?.hideLoading();

        interval &&
          this.mounted &&
          (this.timer = setTimeout(this.reload, Math.max(interval, 3000)));
      })
      .catch(reason => {
        if (env.isCancel(reason)) {
          return;
        }

        isAlive(store) && store.markFetching(false);
        env.notify('error', reason);
        this.echarts?.hideLoading();
      });
  }

  receive(data: object) {
    const store = this.props.store;

    store.updateData(data);
    this.reload();
  }

  hasData(config: any): boolean {
    return (
      (Array.isArray(config.dataset?.source) && config.dataset.source.length) ||
      (Array.isArray(config.series) &&
        config.series.some(
          (item: any) => Array.isArray(item.data) && item.data.length
        ))
    );
  }

  renderChart(config?: object, data?: any) {
    config && (this.pending = config);
    data && (this.pendingCtx = data);

    if (!this.echarts) {
      return;
    }
    let onDataFilter = this.props.onDataFilter;
    const dataFilter = this.props.dataFilter;

    if (!onDataFilter && typeof dataFilter === 'string') {
      onDataFilter = new Function('config', 'echarts', dataFilter) as any;
    }

    config = config || this.pending;
    data = data || this.pendingCtx || this.props.data;

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
        if (!this.props.disableDataMapping) {
          config = dataMapping(
            config,
            data,
            (key: string, value: any) =>
              typeof value === 'function' ||
              (typeof value === 'string' && value.startsWith('function'))
          );
        }

        recoverFunctionType(config!);

        if (this.hasData(config)) {
          this.echarts?.hideLoading();
        } else {
          this.echarts?.showLoading();
        }

        this.echarts?.setOption(config!, this.props.replaceChartOption);
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
