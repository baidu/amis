import React from 'react';
import PropTypes from 'prop-types';
import {Renderer, RendererProps} from 'amis-core';
import {ServiceStore, IServiceStore} from 'amis-core';

import {filter, evalExpression} from 'amis-core';
import cx from 'classnames';
import {LazyComponent} from 'amis-core';
import {resizeSensor} from 'amis-core';
import {resolveVariableAndFilter, isPureVariable, dataMapping} from 'amis-core';
import {
  isApiOutdated,
  isEffectiveApi,
  normalizeApiResponseData
} from 'amis-core';
import {ScopedContext, IScopedContext} from 'amis-core';
import {createObject, findObjectsWithKey} from 'amis-core';
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
import debounce from 'lodash/debounce';

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
 * @param config ECharts 配置
 */
function recoverFunctionType(config: object) {
  [
    'interval',
    'formatter',
    'color',
    'min',
    'max',
    'labelFormatter',
    'valueFormatter',
    'pageFormatter',
    'optionToContent',
    'contentToOption',
    'animationDelay',
    'animationDurationUpdate',
    'animationDelayUpdate',
    'animationDuration',
    'position',
    'sort',
    'renderItem'
  ].forEach((key: string) => {
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

export interface ChartProps
  extends RendererProps,
    Omit<ChartSchema, 'type' | 'className'> {
  chartRef?: (echart: any) => void;
  onDataFilter?: (config: any, echarts: any, data?: any) => any;
  onChartWillMount?: (echarts: any) => void | Promise<void>;
  onChartMount?: (chart: any, echarts: any) => void;
  onChartUnMount?: (chart: any, echarts: any) => void;
  store: IServiceStore;
}
export class Chart extends React.Component<ChartProps> {
  static defaultProps: Partial<ChartProps> = {
    replaceChartOption: false,
    unMountOnHidden: false
  };

  static propsList: Array<string> = [];

  ref: any;
  echarts?: any;
  unSensor: Function;
  pending?: object;
  pendingCtx?: any;
  timer: ReturnType<typeof setTimeout>;
  mounted: boolean;
  reloadCancel?: Function;

  constructor(props: ChartProps) {
    super(props);

    this.refFn = this.refFn.bind(this);
    this.reload = this.reload.bind(this);
    this.reloadEcharts = debounce(this.reloadEcharts.bind(this), 300); //过于频繁更新 ECharts 会报错
    this.handleClick = this.handleClick.bind(this);
    this.mounted = true;

    props.config && this.renderChart(props.config);
  }

  componentDidMount() {
    const {api, data, initFetch, source} = this.props;

    if (source && isPureVariable(source)) {
      const ret = resolveVariableAndFilter(source, data, '| raw');
      ret && this.renderChart(ret);
    } else if (api && initFetch !== false) {
      this.reload();
    }
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
    (this.reloadEcharts as any).cancel();
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
    const {chartTheme, onChartWillMount, onChartUnMount, env} = this.props;
    let onChartMount = this.props.onChartMount;

    if (ref) {
      Promise.all([
        import('echarts'),
        import('echarts-stat'),
        // @ts-ignore 官方没提供 type
        import('echarts/extension/dataTool'),
        // @ts-ignore 官方没提供 type
        import('echarts/extension/bmap/bmap')
      ]).then(async ([echarts, ecStat]) => {
        if(ecStat.default != null) {
          ecStat = ecStat.default;
        }
        (window as any).echarts = echarts;
        (window as any).ecStat = ecStat;
        let theme = 'default';

        if (chartTheme) {
          echarts.registerTheme('custom', chartTheme);
          theme = 'custom';
        }

        if (onChartWillMount) {
          await onChartWillMount(echarts);
        }

        (echarts as any).registerTransform(
          (ecStat as any).transform.regression
        );
        (echarts as any).registerTransform((ecStat as any).transform.histogram);
        (echarts as any).registerTransform(
          (ecStat as any).transform.clustering
        );

        if (env.loadChartExtends) {
          await env.loadChartExtends();
        }

        this.echarts = (echarts as any).init(ref, theme);

        if (typeof onChartMount === 'string') {
          onChartMount = new Function('chart', 'echarts') as any;
        }

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
    const {api, env, store, interval, translate: __} = this.props;

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
            result.msg || __('fetchFailed'),
            result.msgTimeout !== undefined
              ? {
                  closeButton: true,
                  timeout: result.msgTimeout
                }
              : undefined
          );
        }
        delete this.reloadCancel;

        const data = normalizeApiResponseData(result.data);
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
          (this.timer = setTimeout(this.reload, Math.max(interval, 1000)));
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

  renderChart(config?: object, data?: any) {
    config && (this.pending = config);
    data && (this.pendingCtx = data);

    if (!this.echarts) {
      return;
    }

    const store = this.props.store;
    let onDataFilter = this.props.onDataFilter;
    const dataFilter = this.props.dataFilter;

    if (!onDataFilter && typeof dataFilter === 'string') {
      onDataFilter = new Function(
        'config',
        'echarts',
        'data',
        dataFilter
      ) as any;
    }

    config = config || this.pending;
    data = data || this.pendingCtx || this.props.data;

    if (typeof config === 'string') {
      config = new Function('return ' + config)();
    }
    try {
      onDataFilter &&
        (config =
          onDataFilter(config, (window as any).echarts, data) || config);
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

        if (isAlive(store) && store.loading) {
          this.echarts?.showLoading();
        } else {
          this.echarts?.hideLoading();
        }
        this.reloadEcharts(config);
      } catch (e) {
        console.warn(e);
      }
    }
  }

  reloadEcharts(config: any) {
    this.echarts?.setOption(config!, this.props.replaceChartOption);
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
      <div className={cx(`${ns}Chart`, className)} style={style}>
        <LazyComponent
          unMountOnHidden={unMountOnHidden}
          placeholder="..." // 之前那个 spinner 会导致 sensor 失效
          component={() => (
            <div className={`${ns}Chart-content`} ref={this.refFn}></div>
          )}
        />
      </div>
    );
  }
}

@Renderer({
  type: 'chart',
  storeType: ServiceStore.name
})
export class ChartRenderer extends Chart {
  static contextType = ScopedContext;

  constructor(props: ChartProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }

  setData(values: object) {
    const {store} = this.props;
    store.updateData(values);
    // 重新渲染
    this.renderChart(this.props.config, values);
  }
}
