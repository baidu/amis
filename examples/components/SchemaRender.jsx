import * as React from 'react';
import {render} from '../../src/index';
import * as axios from 'axios';
import {toast} from '../../src/components/Toast';
import {alert, confirm} from '../../src/components/Alert';
import Button from '../../src/components/Button'
import LazyComponent from '../../src/components/LazyComponent'
import {default as DrawerContainer} from '../../src/components/Drawer'
import { Portal } from 'react-overlays';
function loadEditor() {
    return new Promise((resolve) => require(['../../src/components/Editor'], (component) => resolve(component.default)));
}
export default function(schema) {
    if (!schema['$schema']) {
        schema = {
            '$schema': 'https://houtai.baidu.com/v2/schemas/page.json',
            ...schema
        };
    }

    return class extends React.Component {
        static displayName = 'SchemaRenderer';
        state = {open: false};
        toggleCode = () => this.setState({
            open: !this.state.open
        });
        close = () => this.setState({
            open: false
        });
        constructor(props) {
            super(props);
            const {router} = props;
            const normalizeLink = (to) => {
                to = to || '';
                const location = router.getCurrentLocation();

                if (to && to[0] === '#') {
                    to = location.pathname + location.search + to;
                } else if (to && to[0] === '?') {
                    to = location.pathname + to;
                }

                const idx = to.indexOf('?');
                const idx2 = to.indexOf('#');
                let pathname =  ~idx ? to.substring(0, idx) : ~idx2 ? to.substring(0, idx2) : to;
                let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
                let hash = ~idx2 ? to.substring(idx2) : '';
    
                if (!pathname) {
                    pathname = location.pathname;
                } else if (pathname[0] != '/' && !/^https?:\/\//.test(pathname)) {
                    // todo 把相对路径转成绝对路径。
                }
    
                return pathname + search + hash;
            }
            this.env = {
                updateLocation: (location, replace) => {
                    router[replace ? 'replace' : 'push'](normalizeLink(location));
                },
                isCurrentUrl: (to) => {
                    const link = normalizeLink(to);
                    return router.isActive(link);
                },
                jumpTo: (to) => {
                    to = normalizeLink(to);
    
                    if (/^https?:\/\//.test(to)) {
                        window.location.replace(to);
                    } else {
                        router.push(to);
                    }
                },
                fetcher: ({
                    url,
                    method,
                    data,
                    config
                }) => {
                    if (data && data instanceof FormData) {
                        // config.headers = config.headers || {};
                        // config.headers['Content-Type'] = 'multipart/form-data';
                    } else if (data 
                        && typeof data !== 'string'
                        && !(data instanceof Blob) 
                        && !(data instanceof ArrayBuffer)
                    ) {
                        data = JSON.stringify(data);
                        config = config || {};
                        config.headers = config.headers || {};
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
                notify: (type, msg) => toast[type] ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息') : console.warn('[Notify]', type, msg),
                alert,
                confirm,
                copy: (content) => console.log('Copy', content)
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
            const {
                router,
                location,
                theme
            } = this.props;

            return render(schema, {
                location,
                theme
            }, this.env);
        }

        render() {
            const ns = this.props.classPrefix;
            return (
                <div className="schema-wrapper">
                    <DrawerContainer
                        classPrefix={ns}
                        size="lg"
                        onHide={this.close}
                        show={this.state.open}
                        position="left"
                    >
                       {this.state.open ? this.renderCode() : null}
                    </DrawerContainer>
                    {this.renderSchema()}
                    <Portal container={() => document.querySelector('.navbar-nav')}>
                        <Button classPrefix={ns} onClick={this.toggleCode} active={this.state.open} iconOnly tooltip="查看源码" level="link" placement="bottom" className="view-code"><i className="fa fa-code" /></Button>
                    </Portal>
                </div>
            );
        }
    }
}
