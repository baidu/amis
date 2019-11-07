import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import cx from 'classnames';
import getExprProperties from '../utils/filter-schema';
import {Api, Payload} from '../types';
import update = require('react-addons-update');
import {isEffectiveApi, isApiOutdated} from '../utils/api';
import {ScopedContext, IScopedContext} from '../Scoped';

export interface TaskProps extends RendererProps {
  className?: string;
  items: Array<TaskItem>;
  checkApi: Api;
  submitApi: Api;
  reSubmitApi: Api;

  tableClassName?: string;
  taskNameLabel?: string;
  operationLabel?: string;
  statusLabel?: string;
  remarkLabel?: string;
  btnText?: string;
  retryBtnText?: string;
  btnClassName?: string;
  retryBtnClassName?: string;
  statusLabelMap?: Array<string>;
  statusTextMap?: Array<string>;
  initialStatusCode?: any;
  readyStatusCode?: any;
  loadingStatusCode?: any;
  errorStatusCode?: any;
  finishStatusCode?: any;
  canRetryStatusCode?: any;
  interval?: number;
}

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
    className: 'b-a bg-white table-responsive',
    tableClassName: 'table table-striped m-b-none',
    taskNameLabel: '任务名称',
    operationLabel: '操作',
    statusLabel: '状态',
    remarkLabel: '备注说明',
    btnText: '上线',
    retryBtnText: '重试',
    btnClassName: 'btn-sm btn-default',
    retryBtnClassName: 'btn-sm btn-danger',
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

  componentWillReceiveProps(nextProps: TaskProps) {
    const props = this.props;

    if (props.items !== nextProps.items) {
      this.setState({
        items: nextProps.items ? nextProps.items.concat() : []
      });
    }
  }

  componentDidUpdate(prevProps: TaskProps) {
    const props = this.props;

    if (
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
      return alert('checkApi 没有设置, 不能及时获取任务状态');
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
      return alert(
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
      return alert('submitApi 没有配置');
    } else if (retry && !isEffectiveApi(reSubmitApi)) {
      return alert('reSubmitApi 没有配置');
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
        .fetcher(api, {
          ...data,
          ...item
        })
        .then((ret: Payload) => {
          if (ret && ret.data) {
            if (Array.isArray(ret.data)) {
              this.handleLoaded(ret);
            } else {
              const items = this.state.items.map(item =>
                item.key === ret.data.key
                  ? {
                      ...item,
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
      render
    } = this.props;
    const items = this.state.items;
    const error = this.state.error;

    return (
      <div className={className}>
        <table className={tableClassName}>
          <thead>
            <tr>
              <th>{taskNameLabel}</th>
              <th>{operationLabel}</th>
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
                      <i className="fa fa-spinner fa-spin fa-2x fa-fw" />
                    ) : item.status == canRetryStatusCode ? (
                      <a
                        onClick={() => this.submitTask(item, key, true)}
                        className={cx('btn', retryBtnClassName || btnClassName)}
                      >
                        {retryBtnText || btnText}
                      </a>
                    ) : (
                      <a
                        onClick={() => this.submitTask(item, key)}
                        className={cx('btn', btnClassName, {
                          disabled: item.status !== readyStatusCode
                        })}
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
  test: /(^|\/)tasks$/,
  name: 'tasks'
})
export class TaskRenderer extends Task {
  static contextType = ScopedContext;

  componentWillMount() {
    // super.componentWillMount();
    const scoped = this.context as IScopedContext;
    scoped.registerComponent(this);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    const scoped = this.context as IScopedContext;
    scoped.unRegisterComponent(this);
  }
}
