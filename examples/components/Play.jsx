import React from 'react';
import {toast} from '../../src/components/Toast';
import {render} from '../../src/index';
import {normalizeLink} from '../../src/utils/normalizeLink';
import {alert, confirm} from '../../src/components/Alert';
import axios from 'axios';
import Frame from 'react-frame-component';
import stripJsonComments from 'strip-json-comments';
import CodeEditor from '../../src/components/Editor';
import copy from 'copy-to-clipboard';

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
            "controls": SCHEMA_PLACEHOLDER,
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
            "controls": [
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
    const {router} = props;

    const schema = this.buildSchema(props.code || DEFAULT_CONTENT, props);
    this.state = {
      asideWidth: props.asideWidth || Math.max(300, window.innerWidth * 0.3),
      schema: schema,
      schemaCode: JSON.stringify(schema, null, 2)
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.removeWindowEvents = this.removeWindowEvents.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.schemaProps = {};
    this.env = {
      session: 'doc',
      updateLocation: (location, replace) => {
        router[replace ? 'replace' : 'push'](normalizeLink(location));
      },
      isCurrentUrl: to => {
        const link = normalizeLink(to);
        return router.isActive(link);
      },
      jumpTo: (to, action) => {
        to = normalizeLink(to);

        if (action && action.actionType === 'url') {
          action.blank === true ? window.open(to) : (window.location.href = to);
          return;
        }

        if (/^https?:\/\//.test(to)) {
          window.location.replace(to);
        } else {
          router.push(to);
        }
      },
      fetcher: config => {
        config = {
          dataType: 'json',
          ...config
        };

        if (config.dataType === 'json' && config.data) {
          config.data = JSON.stringify(config.data);
          config.headers = config.headers || {};
          config.headers['Content-Type'] = 'application/json';
        }

        return axios[config.method](config.url, config.data, config);
      },
      isCancel: value => axios.isCancel(value),
      notify: (type, msg) =>
        toast[type]
          ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
          : console.warn('[Notify]', type, msg),
      alert,
      confirm,
      copy: content => {
        copy(content);
        toast.success('内容已复制到粘贴板');
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

  componentWillReceiveProps(nextprops) {
    const props = this.props;

    if (props.code !== nextprops.code) {
      const schema = this.buildSchema(
        nextprops.code || DEFAULT_CONTENT,
        nextprops
      );
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
      const scope = query.scope || props.scope;

      if (scope && scopes[scope]) {
        schemaContent = scopes[scope].replace(
          'SCHEMA_PLACEHOLDER',
          schemaContent
        );
      }

      schemaContent = stripJsonComments(schemaContent).replace(
        /('|")raw:/g,
        '$1'
      ); // 去掉注释

      const json = {
        ...JSON.parse(schemaContent)
      };

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

    if (this.props.viewMode === 'mobile') {
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
      const schema = JSON.parse(value);
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
        // editorFactory={this.editorFactory}
        editorDidMount={this.editorDidMount}
        language="json"
        editorTheme={theme === 'dark' ? 'vs-dark' : 'vs'}
      />
    );
  }

  render() {
    const {vertical, height} = this.props;
    if (vertical) {
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
