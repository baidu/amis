import React from 'react';
import {toast, render, makeTranslator} from 'amis';
import {normalizeLink} from 'amis/lib/utils/normalizeLink';
import {isMobile} from 'amis/lib/utils/helper';
import attachmentAdpator from 'amis/lib/utils/attachmentAdpator';
import {alert, confirm} from 'amis/lib/components/Alert';
import axios from 'axios';
import JSON5 from 'json5';
import CodeEditor from 'amis/lib/components/Editor';
import copy from 'copy-to-clipboard';
import {matchPath} from 'react-router-dom';
import Drawer from 'amis/lib/components/Drawer';

const DEFAULT_CONTENT = `{
    "$schema": "/schemas/page.json#",
    "type": "page",
    "title": "Title",
    "body": "Body",
    "aside": "Aside",
    "toolbar": "Toolbar"
}`;

const scopes = {
  'none': ``,

  'body': `{
        "type": "page",
        "body": SCHEMA_PLACEHOLDER
    }`,

  'form': `{
        "type": "page",
        "body": {
            "title": "",
            "type": "form",
            "autoFocus": false,
            "api": "/api/mock/saveForm?waitSeconds=1",
            "mode": "horizontal",
            "body": SCHEMA_PLACEHOLDER,
            "submitText": null,
            "actions": []
        }
    }`,

  'form2': `{
      "type": "page",
      "body": {
          "title": "",
          "type": "form",
          "autoFocus": false,
          "api": "/api/mock/saveForm?waitSeconds=1",
          "mode": "horizontal",
          "body": SCHEMA_PLACEHOLDER,
          "submitText": null,
          "actions": []
      }
  }`,

  'form-item': `{
        "type": "page",
        "body": {
            "title": "",
            "type": "form",
            "mode": "horizontal",
            "autoFocus": false,
            "body": [
                SCHEMA_PLACEHOLDER
            ],
            "submitText": null,
            "actions": []
        }
    }`,

  'form-item2': `{
      "type": "page",
      "body": {
          "title": "",
          "type": "form",
          "mode": "horizontal",
          "autoFocus": false,
          "body": [
              SCHEMA_PLACEHOLDER
          ],
          "submitText": null,
          "actions": []
      }
  }`
};

export default class PlayGround extends React.Component {
  state = null;
  startX = 0;
  oldContents = '';
  frameTemplate;
  iframeRef;

  static defaultProps = {
    vertical: false
  };

  constructor(props) {
    super(props);
    this.iframeRef = React.createRef();
    const {history} = props;

    const schema = this.buildSchema(props.code || DEFAULT_CONTENT, props);
    this.state = {
      asideWidth: props.asideWidth || Math.max(300, window.innerWidth * 0.3),
      schema: schema,
      schemaCode: JSON.stringify(schema, null, 2),
      isOpened: false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.removeWindowEvents = this.removeWindowEvents.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.close = this.close.bind(this);
    this.schemaProps = {};

    const __ = makeTranslator(props.locale);

    this.env = {
      session: 'doc',
      updateLocation: (location, replace) => {
        history[replace ? 'replace' : 'push'](normalizeLink(location));
      },
      isCurrentUrl: to => {
        if (!to) {
          return false;
        }
        const link = normalizeLink(to);
        return !!matchPath(history.location.pathname, {
          path: link,
          exact: true
        });
      },
      jumpTo: (to, action) => {
        to = normalizeLink(to);

        if (action && action.actionType === 'url') {
          action.blank === true ? window.open(to) : (window.location.href = to);
          return;
        }

        if (action && to && action.target) {
          window.open(to, action.target);
          return;
        }

        if (/^https?:\/\//.test(to)) {
          window.location.replace(to);
        } else {
          history.push(to);
        }
      },
      fetcher: async api => {
        let {url, method, data, responseType, config, headers} = api;
        config = config || {};
        config.url = url;
        config.withCredentials = true;
        responseType && (config.responseType = responseType);

        if (config.cancelExecutor) {
          config.cancelToken = new axios.CancelToken(config.cancelExecutor);
        }

        config.headers = headers || {};
        config.method = method;
        config.data = data;

        if (method === 'get' && data) {
          config.params = data;
        } else if (data && data instanceof FormData) {
          // config.headers['Content-Type'] = 'multipart/form-data';
        } else if (
          data &&
          typeof data !== 'string' &&
          !(data instanceof Blob) &&
          !(data instanceof ArrayBuffer)
        ) {
          data = JSON.stringify(data);
          config.headers['Content-Type'] = 'application/json';
        }

        // 支持返回各种报错信息
        config.validateStatus = function () {
          return true;
        };

        let response = await axios(config);
        response = await attachmentAdpator(response, __);

        if (response.status >= 400) {
          if (response.data) {
            // 主要用于 raw: 模式下，后端自己校验登录，
            if (
              response.status === 401 &&
              response.data.location &&
              response.data.location.startsWith('http')
            ) {
              location.href = response.data.location.replace(
                '{{redirect}}',
                encodeURIComponent(location.href)
              );
              return new Promise(() => {});
            } else if (response.data.msg) {
              throw new Error(response.data.msg);
            } else {
              throw new Error(
                __('System.requestError') +
                  JSON.stringify(response.data, null, 2)
              );
            }
          } else {
            throw new Error(
              `${__('System.requestErrorStatus')} ${response.status}`
            );
          }
        }

        return response;
      },
      isCancel: value => axios.isCancel(value),
      notify: (type, msg, conf) =>
        toast[type]
          ? toast[type](msg, conf)
          : console.warn('[Notify]', type, msg),
      alert,
      confirm,
      copy: (content, options) => {
        copy(content, options);
        toast.success(__('System.copy'));
      },
      tracker(eventTrack) {
        console.debug('eventTrack', eventTrack);
      },
      replaceText: {
        AMIS_HOST: 'https://baidu.gitee.io/amis'
      }
    };

    this.watchIframeReady = this.watchIframeReady.bind(this);
    window.addEventListener('message', this.watchIframeReady, false);
  }

  watchIframeReady(event) {
    // iframe 里面的 amis 初始化了就可以发数据
    if (event.data && event.data === 'amisReady') {
      this.updateIframe();
    }
  }

  updateIframe() {
    if (this.iframeRef && this.iframeRef.current) {
      this.iframeRef.current.contentWindow.postMessage(
        {
          schema: this.state.schema,
          props: {theme: this.props.theme, locale: this.props.locale}
        },
        '*'
      );
    }
  }

  componentDidUpdate(preProps) {
    const props = this.props;

    if (preProps.code !== props.code) {
      const schema = this.buildSchema(props.code || DEFAULT_CONTENT, props);
      this.setState({
        schema: schema,
        schemaCode: JSON.stringify(schema, null, 2)
      });
    }
  }

  componentDidMount() {
    this.props.setAsideFolded && this.props.setAsideFolded(true);
  }

  componentWillUnmount() {
    this.props.setAsideFolded && this.props.setAsideFolded(false);
    window.removeEventListener('message', this.watchIframeReady, false);
  }

  buildSchema(schemaContent, props = this.props) {
    const query = props.location.query;

    try {
      const scope = props.scope;

      if (scope && scopes[scope]) {
        schemaContent = scopes[scope].replace(
          'SCHEMA_PLACEHOLDER',
          schemaContent
        );
      }

      schemaContent = schemaContent.replace(/('|")raw:/g, '$1'); // 去掉 raw

      const json = JSON5.parse(schemaContent);

      return json;
    } catch (e) {
      console.error(this.formatMessage(e.message, schemaContent));
    }

    return {};
  }

  formatMessage(message, input) {
    if (/position\s?(\d+)$/.test(message)) {
      const lines = input
        .substring(0, parseInt(RegExp.$1, 10))
        .split(/\n|\r\n|\r/);
      message = `Json 语法错误，请检测。出错位置：${lines.length}，列：${
        lines[lines.length - 1].length
      }。`;
    }

    return message;
  }

  renderPreview() {
    const schema = this.state.schema;

    const props = {
      ...this.schemaProps,
      theme: this.props.theme,
      locale: this.props.locale,
      affixHeader: false,
      affixFooter: false
    };

    if (this.props.viewMode === 'mobile' && !isMobile()) {
      return (
        <iframe
          width="375"
          height="100%"
          frameBorder={0}
          className="mobile-frame"
          ref={this.iframeRef}
          // @ts-ignore
          src={__uri('../mobile.html')}
        ></iframe>
      );
    }

    return render(schema, props, this.env);
  }

  handleChange(value) {
    this.setState({
      schemaCode: value
    });
    try {
      const schema = JSON5.parse(value);
      this.setState(
        {
          schema
        },
        () => {
          this.updateIframe();
        }
      );
    } catch (e) {
      //ignore
    }
  }

  handleMouseDown(e) {
    this.startX = e.clientX;
    this.startWidth = this.state.asideWidth;

    // this.startPosition.y = e.clientY;

    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    return false;
  }

  handleMouseMove(e) {
    const diff = this.startX - e.clientX;
    e.preventDefault();

    this.setState({
      asideWidth: Math.min(800, Math.max(200, this.startWidth + diff))
    });
  }

  handleMouseUp() {
    this.removeWindowEvents();
  }

  removeWindowEvents() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  toggleDrawer() {
    this.setState({
      isOpened: !this.state.isOpened
    });
  }

  close() {
    this.setState({
      isOpened: false
    });
  }

  editorDidMount = (editor, monaco) => {
    this.editor = editor;
    this.monaco = monaco;

    let host = `${window.location.protocol}//${window.location.host}`;

    // 如果在 gh-pages 里面
    if (/^\/amis/.test(window.location.pathname)) {
      host += '/amis';
    }

    const schemaUrl = `${host}/schema.json`;

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      schemas: [
        {
          uri: schemaUrl,
          fileMatch: ['*']
        }
      ],
      validate: true,
      enableSchemaRequest: true,
      allowComments: true
    });
  };

  // editorFactory = (containerElement, monaco, options) => {
  //   this.model = monaco.editor.createModel(
  //     this.state.schemaCode,
  //     'json',
  //     monaco.Uri.parse(`isuda://schemas/page.json`)
  //   );

  //   return monaco.editor.create(containerElement, {
  //     autoIndent: true,
  //     formatOnType: true,
  //     formatOnPaste: true,
  //     selectOnLineNumbers: true,
  //     scrollBeyondLastLine: false,
  //     folding: true,
  //     minimap: {
  //       enabled: false
  //     },
  //     ...options,
  //     model: this.model
  //   });
  // };

  renderEditor() {
    const {theme} = this.props;
    return (
      <CodeEditor
        value={this.state.schemaCode}
        onChange={this.handleChange}
        options={{
          lineNumbers: 'off'
        }}
        // editorFactory={this.editorFactory}
        editorDidMount={this.editorDidMount}
        language="json"
        editorTheme={theme === 'dark' ? 'vs-dark' : 'vs'}
      />
    );
  }

  render() {
    const {vertical, mini, height, theme, classPrefix} = this.props;
    if (mini) {
      return (
        <div className="Playgroud Playgroud--mini">
          <a onClick={this.toggleDrawer} className="Playgroud-edit-btn">
            编辑代码 <i className="fa fa-code p-l-xs"></i>
          </a>
          <Drawer
            showCloseButton
            closeOnOutside
            resizable
            theme={theme}
            overlay={false}
            position="right"
            show={this.state.isOpened}
            onHide={this.close}
          >
            <div className={`${classPrefix}Drawer-header`}>
              编辑代码（支持编辑实时预览）
            </div>
            <div className={`${classPrefix}Drawer-body no-padder`}>
              {this.renderEditor()}
            </div>
          </Drawer>
          <div style={{minHeight: height}} className="Playgroud-preview">
            {this.renderPreview()}
          </div>
        </div>
      );
    } else if (vertical) {
      return (
        <div className="Playgroud">
          <div style={{minHeight: height}} className="Playgroud-preview">
            {this.renderPreview()}
          </div>
          <div className="Playgroud-code">{this.renderEditor()}</div>
        </div>
      );
    }

    return (
      <div
        style={{
          position: 'absolute',
          top: 50,
          bottom: 0
        }}
      >
        <div className="hbox">
          <div className="col pos-rlt">
            <div className="scroll-y h-full pos-abt w-full b-b">
              {this.renderPreview()}
            </div>
          </div>
          <div
            className="col bg-light lter b-l bg-auto pos-rlt"
            style={{width: this.state.asideWidth}}
          >
            <div className="resizer" onMouseDown={this.handleMouseDown} />
            {this.renderEditor()}
          </div>
        </div>
      </div>
    );
  }
}
