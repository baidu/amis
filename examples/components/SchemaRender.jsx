import React from 'react';
import {render} from '../../src/index';
import axios from 'axios';
import Portal from 'react-overlays/Portal';
import {toast} from '../../src/components/Toast';
import {normalizeLink} from '../../src/utils/normalizeLink';
import Button from '../../src/components/Button';
import LazyComponent from '../../src/components/LazyComponent';
import {default as DrawerContainer} from '../../src/components/Drawer';

import {withRouter} from 'react-router';
import copy from 'copy-to-clipboard';

function loadEditor() {
  return new Promise(resolve =>
    require(['../../src/components/Editor'], component =>
      resolve(component.default))
  );
}

const viewMode = localStorage.getItem('viewMode') || 'pc';

export default function (schema, showCode, envOverrides) {
  if (!schema['$schema']) {
    schema = {
      ...schema
    };
  }

  return withRouter(
    class extends React.Component {
      static displayName = 'SchemaRenderer';
      iframeRef;
      state = {open: false, schema: {}};
      toggleCode = () =>
        this.setState({
          open: !this.state.open
        });
      copyCode = () => {
        copy(JSON.stringify(schema, null, 2));
        toast.success('页面配置JSON已复制到粘贴板');
      };
      close = () =>
        this.setState({
          open: false
        });
      constructor(props) {
        super(props);

        const {router, route} = props;
        this.env = {
          updateLocation: (location, replace) => {
            router[replace ? 'replace' : 'push'](normalizeLink(location));
          },
          jumpTo: (to, action) => {
            if (to === 'goBack') {
              return router.location.goBack();
            }
            to = normalizeLink(to);
            if (action && action.actionType === 'url') {
              action.blank === false
                ? (window.location.href = to)
                : window.open(to);
              return;
            }
            if (action && to && action.target) {
              window.open(to, action.target);
              return;
            }
            if (/^https?:\/\//.test(to)) {
              window.location.replace(to);
            } else {
              router.push(to);
            }
          },
          isCurrentUrl: to => {
            if (!to) {
              return false;
            }
            const link = normalizeLink(to);
            return router.isActive(link);
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
          copy: (content, options) => {
            copy(content, options);
            toast.success('内容已复制到粘贴板');
          },
          blockRouting: fn => {
            return router.setRouteLeaveHook(route, nextLocation => {
              return fn(nextLocation);
            });
          },
          ...envOverrides
        };

        this.handleEditorMount = this.handleEditorMount.bind(this);

        this.iframeRef = React.createRef();
        this.watchIframeReady = this.watchIframeReady.bind(this);
        window.addEventListener('message', this.watchIframeReady, false);
      }

      handleEditorMount(editor, monaco) {
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
              schema: schema,
              props: {
                location: this.props.location,
                theme: this.props.theme,
                locale: this.props.locale
              }
            },
            '*'
          );
        }
      }

      componentWillUnmount() {
        this.props.setAsideFolded && this.props.setAsideFolded(false);
        window.removeEventListener('message', this.watchIframeReady, false);
      }

      renderSchema() {
        const {router, location, theme, locale} = this.props;

        if (viewMode === 'mobile') {
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
        const finalShowCode = this.props.showCode ?? showCode;
        return (
          <>
            <div className="schema-wrapper">
              {finalShowCode !== false ? (
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
            {finalShowCode !== false ? (
              // <div className="schema-toolbar-wrapper">
              //   <div onClick={this.toggleCode}>
              //     查看页面配置 <i className="fa fa-code p-l-xs"></i>
              //   </div>
              //   <div onClick={this.copyCode}>
              //     复制页面配置 <i className="fa fa-copy p-l-xs"></i>
              //   </div>
              // </div>
              <Portal
                container={() => document.getElementById('Header-toolbar')}
              >
                <div className="hidden-xs hidden-sm ml-3">
                  <div>
                    <div className="Doc-headingList">
                      <div className="Doc-headingList-item">
                        <a onClick={this.toggleCode}>
                          查看配置 <i className="fa fa-code p-l-xs"></i>
                        </a>
                      </div>
                      <div className="Doc-headingList-item">
                        <a onClick={this.copyCode}>
                          复制配置 <i className="fa fa-copy p-l-xs"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Portal>
            ) : null}
          </>
        );
      }
    }
  );
}
