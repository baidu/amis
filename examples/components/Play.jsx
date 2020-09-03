import React from 'react';
import {toast} from '../../src/components/Toast';
import {render} from '../../src/index';
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

  static defaultProps = {
    useIFrame: false,
    vertical: false
  };

  constructor(props) {
    super(props);

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
    this.schemaProps = {
      style: {
        height: '100%'
      }
    };
    const normalizeLink = to => {
      to = to || '';
      const location = router.getCurrentLocation();

      if (to && to[0] === '#') {
        to = location.pathname + location.search + to;
      } else if (to && to[0] === '?') {
        to = location.pathname + to;
      }

      const idx = to.indexOf('?');
      const idx2 = to.indexOf('#');
      let pathname = ~idx
        ? to.substring(0, idx)
        : ~idx2
        ? to.substring(0, idx2)
        : to;
      let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
      let hash = ~idx2 ? to.substring(idx2) : location.hash;

      if (!pathname) {
        pathname = location.pathname;
      } else if (pathname[0] != '/' && !/^https?:\/\//.test(pathname)) {
        let relativeBase = location.pathname;
        const paths = relativeBase.split('/');
        paths.pop();
        let m;
        while ((m = /^\.\.?\//.exec(pathname))) {
          if (m[0] === '../') {
            paths.pop();
          }
          pathname = pathname.substring(m[0].length);
        }
        pathname = paths.concat(pathname).join('/');
      }

      return pathname + search + hash;
    };
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
          action.blank === false
            ? (window.location.href = to)
            : window.open(to);
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

    const links = [].slice
      .call(document.head.querySelectorAll('link,style'))
      .map(item => item.outerHTML);
    this.frameTemplate = `<!DOCTYPE html><html><head>${links.join(
      ''
    )}</head><body><div></div></body></html>`;
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

      let host = `${window.location.protocol}//${window.location.host}`;

      // 如果在 gh-pages 里面
      if (/^\/amis/.test(window.location.pathname)) {
        host = '/amis';
      }

      const json = {
        $schema: `${host}/schemas/page.json#`,
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

    if (!this.props.useIFrame) {
      return render(schema, props, this.env);
    }

    return (
      <Frame
        width="100%"
        height="100%"
        frameBorder={0}
        initialContent={this.frameTemplate}
      >
        {render(schema, props, this.env)}
      </Frame>
    );
  }

  handleChange(value) {
    this.setState({
      schemaCode: value
    });

    try {
      const schema = JSON.parse(value);

      this.setState({
        schema
      });
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

  renderEditor() {
    return (
      <CodeEditor
        value={this.state.schemaCode}
        onChange={this.handleChange}
        language="json"
      />
    );
  }

  render() {
    const {vertical} = this.props;
    if (vertical) {
      return (
        <div className="vbox">
          <div className="row-row">
            <div className="cell pos-rlt">
              <div className="scroll-y h-full pos-abt w-full">
                {this.renderPreview()}
              </div>
            </div>
          </div>
          <div className="row-row b-t" style={{height: 200}}>
            <div className="cell">{this.renderEditor()}</div>
          </div>
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
            <div className="scroll-y h-full pos-abt w-full">
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
