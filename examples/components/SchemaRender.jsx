import React from 'react';
import {render, toast, makeTranslator, LazyComponent, Drawer} from 'amis';
import axios from 'axios';
import Portal from 'react-overlays/Portal';
import {normalizeLink} from 'amis-core';
import {withRouter} from 'react-router-dom';
import copy from 'copy-to-clipboard';
import {
  qsparse,
  parseQuery,
  attachmentAdpator,
  supportsMjs,
  setGlobalOptions
} from 'amis-core';
import isPlainObject from 'lodash/isPlainObject';
import {pdfUrlLoad} from '../loadPdfjsWorker';

function loadEditor() {
  return new Promise(resolve =>
    import('amis-ui').then(component => resolve(component.Editor))
  );
}

const viewMode = localStorage.getItem('amis-viewMode') || 'pc';

setGlobalOptions({
  pdfjsWorkerSrc: supportsMjs() ? pdfUrlLoad() : ''
});

/**
 *
 * @param {*} schema schema配置
 * @param {*} schemaProps props配置
 * @param {*} showCode 是否展示代码
 * @param {Object} envOverrides 覆写环境变量
 * @returns
 */
export default function (schema, schemaProps, showCode, envOverrides) {
  if (!schema['$schema']) {
    schema = {
      ...schema
    };
  }

  if (!schema.type && schema.schema) {
    schemaProps = schema.props;
    envOverrides = schema.env;
    showCode = schema.showCode ?? true;
    schema = {
      ...schema.schema
    };
  }

  return withRouter(
    class extends React.Component {
      static displayName = 'SchemaRenderer';
      iframeRef;
      state = {open: false, schema: {}};
      originalTitle = document.title;
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

        const __ = makeTranslator(props.locale);
        const {history} = props;
        this.env = {
          updateLocation: (location, replace) => {
            history[replace ? 'replace' : 'push'](normalizeLink(location));
          },
          jumpTo: (to, action) => {
            if (to === 'goBack') {
              return history.location.goBack();
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
              history.push(to);
            }
          },
          isCurrentUrl: to => {
            const history = this.props.history;
            const link = normalizeLink(to);
            const location = history.location;
            let pathname = link;
            let search = '';
            const idx = link.indexOf('?');
            if (~idx) {
              pathname = link.substring(0, idx);
              search = link.substring(idx);
            }

            if (search) {
              if (pathname !== location.pathname || !location.search) {
                return false;
              }
              const currentQuery = parseQuery(location);
              const query = qsparse(search.substring(1));

              return Object.keys(query).every(
                key => query[key] === currentQuery[key]
              );
            } else if (pathname === location.pathname) {
              return true;
            }

            return false;
          },
          fetcher: async api => {
            let {url, method, data, responseType, config, headers} = api;
            config = config || {};
            config.url = url;
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
            response = await attachmentAdpator(response, __, api);

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
                  throw new Error(JSON.stringify(response.data, null, 2));
                }
              } else {
                throw new Error(`${response.status}`);
              }
            }

            return response;
          },
          isCancel: value => axios.isCancel(value),
          copy: (content, options) => {
            copy(content, options);
            toast.success('内容已复制到粘贴板');
          },
          blockRouting: fn => {
            return history.block(fn);
          },
          tracker(eventTrack) {
            console.debug('eventTrack', eventTrack);
          },
          loadTinymcePlugin: async tinymce => {
            // 参考：https://www.tiny.cloud/docs/advanced/creating-a-plugin/
            /*
              Note: We have included the plugin in the same JavaScript file as the TinyMCE
              instance for display purposes only. Tiny recommends not maintaining the plugin
              with the TinyMCE instance and using the `external_plugins` option.
            */
            tinymce.PluginManager.add('example', function (editor, url) {
              var openDialog = function () {
                return editor.windowManager.open({
                  title: 'Example plugin',
                  body: {
                    type: 'panel',
                    items: [
                      {
                        type: 'input',
                        name: 'title',
                        label: 'Title'
                      }
                    ]
                  },
                  buttons: [
                    {
                      type: 'cancel',
                      text: 'Close'
                    },
                    {
                      type: 'submit',
                      text: 'Save',
                      primary: true
                    }
                  ],
                  onSubmit: function (api) {
                    var data = api.getData();
                    /* Insert content when the window form is submitted */
                    editor.insertContent('Title: ' + data.title);
                    api.close();
                  }
                });
              };
              /* Add a button that opens a window */
              editor.ui.registry.addButton('example', {
                text: 'My button',
                onAction: function () {
                  /* Open window */
                  openDialog();
                }
              });
              /* Adds a menu item, which can then be included in any menu via the menu/menubar configuration */
              editor.ui.registry.addMenuItem('example', {
                text: 'Example plugin',
                onAction: function () {
                  /* Open window */
                  openDialog();
                }
              });
              /* Return the metadata for the help plugin */
              return {
                getMetadata: function () {
                  return {
                    name: 'Example plugin',
                    url: 'http://exampleplugindocsurl.com'
                  };
                }
              };
            });
          },
          // 是否开启测试 testid
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
                ...(isPlainObject(schemaProps) ? schemaProps : {}),
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
        document.title = this.originalTitle;
      }

      componentDidMount() {
        if (schema.title) {
          document.title = schema.title;
        }
      }

      renderSchema() {
        const {location, theme, locale} = this.props;

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
            ...(isPlainObject(schemaProps) ? schemaProps : {}),
            context: {
              // 上下文信息，无论那层可以获取到这个
              amisUser: {
                id: 1,
                name: 'AMIS User'
              }
            },
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
                <Drawer
                  classPrefix={ns}
                  size="lg"
                  onHide={this.close}
                  show={this.state.open}
                  // overlay={false}
                  closeOnOutside={true}
                  position="right"
                >
                  {this.state.open ? this.renderCode() : null}
                </Drawer>
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
