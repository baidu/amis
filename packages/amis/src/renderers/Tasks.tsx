import React from 'react';
import {Renderer, RendererProps} from 'amis-core';
import {ServiceStore, IServiceStore} from 'amis-core';
import cx from 'classnames';
import {getExprProperties} from 'amis-core';
import {Api, ApiObject, Payload} from 'amis-core';
import update from 'immutability-helper';
import {isEffectiveApi, isApiOutdated} from 'amis-core';
import {ScopedContext, IScopedContext} from 'amis-core';
import {Spinner} from 'amis-ui';
import {BaseSchema, SchemaApi, SchemaClassName, SchemaName} from '../Schema';
import {createObject} from 'amis-core';

/**
 * Tasks 渲染器，格式说明
 * 文档：https://baidu.gitee.io/amis/docs/components/tasks
 */
export interface TasksSchema extends BaseSchema {
  /** 指定为任务类型 */
  type: 'tasks';

  btnClassName?: SchemaClassName;

  /**
   * 操作按钮文字
   * @default 上线
   */
  btnText?: string;

  /**
   * 用来获取任务状态的 API，当没有进行时任务时不会发送。
   */
  checkApi?: SchemaApi;

  /**
   * 当有任务进行中，会每隔一段时间再次检测，而时间间隔就是通过此项配置，默认 3s。
   * @default 3000
   */
  interval?: number;

  items?: Array<{
    /**
     * 任务键值，请唯一区分
     */
    key?: string;

    /**
     * 任务名称
     */
    label?: string;

    /**
     * 当前任务状态，支持 html
     */
    remark?: string;

    /**
     * 任务状态：
     * 0: 初始状态，不可操作。
     * 1: 就绪，可操作状态。
     * 2: 进行中，还没有结束。
     * 3：有错误，不可重试。
     * 4: 已正常结束。
     * 5：有错误，且可以重试。
     */
    status?: 0 | 1 | 2 | 3 | 4 | 5;
  }>;

  name?: SchemaName;

  /**
   * 操作列说明
   */
  operationLabel?: string;

  /**
   * 如果任务失败，且可以重试，提交的时候会使用此 API
   */
  reSubmitApi?: SchemaApi;

  /**
   * 备注列说明
   * @default 备注
   */
  remarkLabel?: string;

  /**
   * 配置容器重试按钮 className
   * @default btn-sm btn-danger
   */
  retryBtnClassName?: SchemaClassName;

  /**
   * 重试操作按钮文字
   * @default 重试
   */
  retryBtnText?: string;

  /**
   * 状态列说明
   * @default 状态
   */
  statusLabel?: string;

  /**
   * 状态显示对应的类名配置。
   * @default [ "label-warning", "label-info", "label-success", "label-danger", "label-default", "label-danger" ]
   */
  statusLabelMap?: Array<string>;

  /**
   * 状态显示对应的文字显示配置。
   * @default ["未开始", "就绪", "进行中", "出错", "已完成", "出错"],
   */
  statusTextMap?: Array<string>;

  /**
   * 提交任务使用的 API
   */
  submitApi?: SchemaApi;

  /**
   * 配置 table className
   */
  tableClassName?: SchemaClassName;

  /**
   * 任务名称列说明
   * @default 任务名称
   */
  taskNameLabel?: string;

  initialStatusCode?: number;
  readyStatusCode?: number;
  loadingStatusCode?: number;
  canRetryStatusCode?: number;
  finishStatusCode?: number;
  errorStatusCode?: number;
}

export interface TaskProps
  extends RendererProps,
    Omit<TasksSchema, 'className'> {}

export interface TaskItem {
  label?: string;
  key?: string;
  remark?: string;
  status?: any;
}

export interface TaskState {
  error?: string;
  items: Array<TaskItem>;
}

export default class Task extends React.Component<TaskProps, TaskState> {
  static defaultProps: Partial<TaskProps> = {
    className: '',
    tableClassName: '',
    taskNameLabel: '任务名称',
    operationLabel: 'Table.operation',
    statusLabel: '状态',
    remarkLabel: '备注说明',
    btnText: '上线',
    retryBtnText: '重试',
    btnClassName: '',
    retryBtnClassName: '',
    statusLabelMap: [
      'label-warning',
      'label-info',
      'label-info',
      'label-danger',
      'label-success',
      'label-danger'
    ],
    statusTextMap: ['未开始', '就绪', '进行中', '出错', '已完成', '出错'],
    initialStatusCode: 0,
    readyStatusCode: 1,
    loadingStatusCode: 2,
    errorStatusCode: 3,
    finishStatusCode: 4,
    canRetryStatusCode: 5,
    interval: 3000
  };

  timer: any;

  constructor(props: TaskProps) {
    super(props);
    this.state = {
      items: props.items ? props.items.concat() : []
    };

    this.handleLoaded = this.handleLoaded.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.tick(!!this.props.checkApi);
  }

  componentDidUpdate(prevProps: TaskProps) {
    const props = this.props;

    if (prevProps.items !== props.items) {
      this.setState({
        items: props.items ? props.items.concat() : []
      });
    } else if (
      isApiOutdated(
        prevProps.checkApi,
        props.checkApi,
        prevProps.data,
        props.data
      )
    ) {
      this.tick(true);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  reload() {
    this.tick(true);
  }

  tick(force = false) {
    const {loadingStatusCode, data, interval, checkApi, env} = this.props;
    const items = this.state.items;
    clearTimeout(this.timer);

    // 如果每个 task 都完成了, 则不需要取查看状态.
    if (!force && !items.some(item => item.status === loadingStatusCode)) {
      return;
    }

    if (interval && !isEffectiveApi(checkApi)) {
      return env.alert('checkApi 没有设置, 不能及时获取任务状态');
    }

    isEffectiveApi(checkApi, data) &&
      env &&
      env
        .fetcher(checkApi, data)
        .then(this.handleLoaded)
        .catch(e => this.setState({error: e}));
  }

  handleLoaded(ret: Payload) {
    if (!Array.isArray(ret.data)) {
      return this.props.env.alert(
        '返回格式不正确, 期望 response.data 为数组, 包含每个 task 的状态信息'
      );
    }

    this.setState({
      items: ret.data
    });

    const interval = this.props.interval;
    clearTimeout(this.timer);
    this.timer = setTimeout(this.tick, interval);
  }

  submitTask(item: TaskItem, index: number, retry = false) {
    const {
      submitApi,
      reSubmitApi,
      loadingStatusCode,
      errorStatusCode,
      data,
      env
    } = this.props;

    if (!retry && !isEffectiveApi(submitApi)) {
      return env.alert('submitApi 没有配置');
    } else if (retry && !isEffectiveApi(reSubmitApi)) {
      return env.alert('reSubmitApi 没有配置');
    }

    this.setState(
      update(this.state, {
        items: {
          $splice: [
            [
              index,
              1,
              {
                ...item,
                status: loadingStatusCode
              }
            ]
          ]
        }
      } as any)
    );

    const api = retry ? reSubmitApi : submitApi;
    isEffectiveApi(api, data) &&
      env &&
      env
        .fetcher(api, createObject(data, item))
        .then((ret: Payload) => {
          if (ret && ret.data) {
            if (Array.isArray(ret.data)) {
              this.handleLoaded(ret);
            } else {
              let replace = api && (api as any).replaceData;
              const items = this.state.items.map(item =>
                item.key === ret.data.key
                  ? {
                      ...((api as any).replaceData ? {} : item),
                      ...ret.data
                    }
                  : item
              );
              this.handleLoaded({
                ...ret,
                data: items
              });
            }
            return;
          }

          clearTimeout(this.timer);
          this.timer = setTimeout(this.tick, 4);
        })
        .catch(e =>
          this.setState(
            update(this.state, {
              items: {
                $splice: [
                  [
                    index,
                    1,
                    {
                      ...item,
                      status: errorStatusCode,
                      remark: e.message || e
                    }
                  ]
                ]
              }
            } as any)
          )
        );
  }

  render() {
    const {
      classnames: cx,
      className,
      tableClassName,
      taskNameLabel,
      operationLabel,
      statusLabel,
      remarkLabel,
      btnText,
      retryBtnText,
      btnClassName,
      retryBtnClassName,
      statusLabelMap,
      statusTextMap,
      readyStatusCode,
      loadingStatusCode,
      canRetryStatusCode,
      translate: __,
      render
    } = this.props;
    const items = this.state.items;
    const error = this.state.error;

    return (
      <div className={cx('Table-content', className)}>
        <table className={cx('Table-table', tableClassName)}>
          <thead>
            <tr>
              <th>{taskNameLabel}</th>
              <th>{__(operationLabel)}</th>
              <th>{statusLabel}</th>
              <th>{remarkLabel}</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan={4}>
                  <div className="text-danger">{error}</div>
                </td>
              </tr>
            ) : (
              items.map((item, key) => (
                <tr key={key}>
                  <td>{item.label}</td>
                  <td>
                    {item.status == loadingStatusCode ? (
                      <Spinner
                        show
                        icon="reload"
                        spinnerClassName={cx('Task-spinner')}
                      />
                    ) : item.status == canRetryStatusCode ? (
                      <a
                        onClick={() => this.submitTask(item, key, true)}
                        className={cx(
                          'Button',
                          'Button--danger',
                          'Button--size-md',
                          retryBtnClassName || btnClassName
                        )}
                      >
                        {retryBtnText || btnText}
                      </a>
                    ) : (
                      <a
                        onClick={() => this.submitTask(item, key)}
                        className={cx(
                          'Button',
                          'Button--default',
                          'Button--size-md',
                          btnClassName,
                          {
                            disabled: item.status !== readyStatusCode
                          }
                        )}
                      >
                        {btnText}
                      </a>
                    )}
                  </td>
                  <td>
                    <span
                      className={cx(
                        'label',
                        statusLabelMap && statusLabelMap[item.status || 0]
                      )}
                    >
                      {statusTextMap && statusTextMap[item.status || 0]}
                    </span>
                  </td>
                  <td>
                    {item.remark ? render(`${key}/remark`, item.remark) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

@Renderer({
  type: 'tasks'
})
export class TaskRenderer extends Task {
  static contextType = ScopedContext;

  constructor(props: TaskProps, context: IScopedContext) {
    super(props);

    const scoped = context;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
