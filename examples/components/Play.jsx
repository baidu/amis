import * as React from 'react';
import {
    toast
} from '../../src/components/Toast';
import {render} from '../../src/index';
import * as axios from 'axios';
import Frame from 'react-frame-component';
import * as stripJsonComments from 'strip-json-comments';
import CodeEditor from '../../src/components/Editor';

const DEFAULT_CONTENT = `{
    "$schema": "https://houtai.baidu.com/v2/schemas/page.json#",
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
        this.env = {
            updateLocation: () => {
            },
            fetcher: config => {
                config = {
                    dataType: 'json',
                    ...config
                };

                if (config.dataType === 'json' && config.data) {
                    config.data = JSON.stringify(config.data)
                    config.headers = config.headers || {};
                    config.headers['Content-Type'] = 'application/json';
                }

                return axios[config.method](config.url, config.data, config);
            },
            notify: (type, msg) => toast[type] ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息') : console.warn('[Notify]', type, msg)
        }

        const links = [].slice.call(document.head.querySelectorAll('link,style')).map(item => item.outerHTML);
        this.frameTemplate = `<!DOCTYPE html><html><head>${links.join('')}</head><body><div></div></body></html>`;
        this.handleEditorMount = this.handleEditorMount.bind(this);
    }

    componentWillReceiveProps(nextprops) {
        const props = this.props;

        if (props.code !== nextprops.code) {
            const schema = this.buildSchema(nextprops.code || DEFAULT_CONTENT, nextprops);
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
                schemaContent = scopes[scope].replace('SCHEMA_PLACEHOLDER', schemaContent);
            }

            schemaContent = stripJsonComments(schemaContent).replace(/('|")raw:/g, '$1'); // 去掉注释

            return JSON.parse(schemaContent);
        } catch (e) {
            console.error(this.formatMessage(e.message, schemaContent));
        }

        return {};
    }

    formatMessage(message, input) {
        if (/position\s?(\d+)$/.test(message)) {
            const lines = input.substring(0, parseInt(RegExp.$1, 10)).split(/\n|\r\n|\r/);
            message = `Json 语法错误，请检测。出错位置：${lines.length}，列：${lines[lines.length -1].length}。`;
        }

        return message;
    }

    renderPreview() {
        const schema = this.state.schema;

        if (!this.props.useIFrame) {
            return render(schema, this.schemaProps, this.env);
        }

        return (
            <Frame
                width="100%"
                height="100%"
                frameBorder={0}
                initialContent={this.frameTemplate}
            >
                {render(schema, this.schemaProps, this.env)}
            </Frame>
        );
    }

    handleEditorMount(editor, monaco) {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            enableSchemaRequest: true,
            validate: true
        });
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
                editorDidMount={this.handleEditorMount}
            />
        );
    }

    render() {
        const {
            vertical
        } = this.props;
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
                    <div className="row-row" style={{height: 200}}>
                        <div className="cell">
                            {this.renderEditor()}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div style={{
                position: "absolute",
                top: 50,
                bottom: 0
            }}>
                <div className="hbox">
                    <div className="col pos-rlt">
                        <div className="scroll-y h-full pos-abt w-full">
                            {this.renderPreview()}
                        </div>
                    </div>
                    <div className="col bg-light lter b-l bg-auto pos-rlt" style={{width: this.state.asideWidth}}>
                        <div className="resizer" onMouseDown={this.handleMouseDown}></div>
                        {this.renderEditor()}
                    </div>
                </div>
            </div>
        );
    }
}
