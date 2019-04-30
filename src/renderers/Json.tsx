import * as React from 'react';
import {
    Renderer,
    RendererProps
} from '../factory';
import {ServiceStore, IServiceStore} from '../store/service';
import {
    Api,
    SchemaNode
} from '../types';
import {
    filter
} from '../utils/tpl';
import * as cx from 'classnames';

import JSONTree from 'react-json-tree';

export interface JSONProps extends RendererProps {
    className?: string;
    placeholder?: string;
    levelExpand: number;
    theme: string | object;
}

const twilight = {
    scheme: 'twilight',
    author: 'david hart (http://hart-dev.com)',
    base00: '#1e1e1e',
    base01: '#323537',
    base02: '#464b50',
    base03: '#5f5a60',
    base04: '#838184',
    base05: '#a7a7a7',
    base06: '#c3c3c3',
    base07: '#ffffff',
    base08: '#cf6a4c',
    base09: '#cda869',
    base0A: '#f9ee98',
    base0B: '#8f9d6a',
    base0C: '#afc4db',
    base0D: '#7587a6',
    base0E: '#9b859d',
    base0F: '#9b703f',
    tree: {
        border: 0,
        padding: '0 0.625em 0.425em',
        marginTop: '-0.25em',
        marginBottom: '0',
        marginLeft: '0',
        marginRight: 0,
        listStyle: 'none',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        whiteSpace: 'nowrap',
        display: 'inline-block'
    }
}

export class JSONField extends React.Component<JSONProps, object> {
    static defaultProps:Partial<JSONProps> = {
        placeholder: '-',
        levelExpand: 1
    };

    valueRenderer(raw:any) {
        if (typeof raw === 'string' && /^\"?https?:\/\//.test(raw)) {
          return (<a href={raw.replace(/^\"(.*)\"$/, '$1')} target="_blank">{raw}</a>);
        }
        return raw;
    }

    shouldExpandNode = (keyName:any, data:any, level:any) => {
        const {
            levelExpand
        } = this.props;
        return level < levelExpand;
    };

    render() {
        const {
            className,
            value,
            classnames: cx
        } = this.props;

        let data = value;

        if (typeof value === 'string') {
            try {
                data = JSON.parse(value);
            } catch (e) {
                data = {
                    error: e.message
                };
            }
        }

        return (
            <div className={cx('JsonField', className)}>
                <JSONTree
                    data={data}
                    theme={twilight}
                    shouldExpandNode={this.shouldExpandNode}
                    valueRenderer={this.valueRenderer}
                />
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)json$/,
    name: 'json'
})
export class JSONFieldRenderer extends JSONField {}