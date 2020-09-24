import React from 'react';
import {render} from '../../src/index';
import axios from 'axios';
import {toast} from '../../src/components/Toast';
import {alert, confirm} from '../../src/components/Alert';
import Button from '../../src/components/Button';
import LazyComponent from '../../src/components/LazyComponent';
import {default as DrawerContainer} from '../../src/components/Drawer';
import {Portal} from 'react-overlays';
import {withRouter} from 'react-router';
import copy from 'copy-to-clipboard';
function loadEditor() {
  return new Promise(resolve =>
    require(['../../src/components/Editor'], component =>
      resolve(component.default))
  );
}
export default function (schema) {
  if (!schema['$schema']) {
    schema = {
      $schema: 'https://houtai.baidu.com/v2/schemas/page.json',
      ...schema
    };
  }

  return withRouter(
    class extends React.Component {
      static displayName = 'SchemaRenderer';
      state = {open: false};
      toggleCode = () =>
        this.setState({
          open: !this.state.open
        });
      copyCode = () => {
        copy(JSON.stringify(schema));
        toast.success('页面配置JSON已复制到粘贴板');
      };
      close = () =>
        this.setState({
          open: false
        });
      constructor(props) {
        super(props);
        const {router} = props;
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
          fetcher: ({url, method, data, config, headers}) => {
            config = config || {};
            config.headers = headers || {};

            if (config.cancelExecutor) {
              config.cancelToken = new axios.CancelToken(config.cancelExecutor);
            }

            if (data && data instanceof FormData) {
              // config.headers = config.headers || {};
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

            if (method !== 'post' && method !== 'put' && method !== 'patch') {
              if (data) {
                if (method === 'delete') {
                  config.data = data;
                } else {
                  config.params = data;
                }
              }

              return axios[method](url, config);
            }

            return axios[method](url, data, config);
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

        this.handleEditorMount = this.handleEditorMount.bind(this);
      }

      handleEditorMount(editor, monaco) {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          enableSchemaRequest: true,
          validate: true
        });
      }

      renderCode() {
        return (
          <LazyComponent
            getComponent={loadEditor}
            editorDidMount={this.handleEditorMount}
            language="json"
            value={schema}
            placeholder="加载中，请稍后。。。"
            disabled
          />
        );
      }

      renderSchema() {
        const {router, location, theme, locale} = this.props;

        return render(
          schema,
          {
            location,
            theme,
            locale
          },
          this.env
        );
      }

      render() {
        const ns = this.props.classPrefix;
        const showCode = this.props.showCode;
        return (
          <>
            <div className="schema-wrapper">
              {showCode !== false ? (
                <DrawerContainer
                  classPrefix={ns}
                  size="lg"
                  onHide={this.close}
                  show={this.state.open}
                  // overlay={false}
                  closeOnOutside={true}
                  position="right"
                >
                  {this.state.open ? this.renderCode() : null}
                </DrawerContainer>
              ) : null}
              {this.renderSchema()}
            </div>
            {showCode !== false ? (
              // <div className="schema-toolbar-wrapper">
              //   <div onClick={this.toggleCode}>
              //     查看页面配置 <i className="fa fa-code p-l-xs"></i>
              //   </div>
              //   <div onClick={this.copyCode}>
              //     复制页面配置 <i className="fa fa-copy p-l-xs"></i>
              //   </div>
              // </div>
              <div className="Doc-toc">
                <div>
                  <div className="Doc-headingList">
                    <div className="Doc-headingList-item">
                      <a onClick={this.toggleCode}>
                        查看页面配置 <i className="fa fa-code p-l-xs"></i>
                      </a>
                    </div>
                    <div className="Doc-headingList-item">
                      <a onClick={this.copyCode}>
                        复制页面配置 <i className="fa fa-copy p-l-xs"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        );
      }
    }
  );
}
