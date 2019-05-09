import * as React from 'react';
import {
    FormItem,
    Renderer
} from '../../../src/index';

@FormItem({
    type: 'custom'
})
class MyFormItem extends React.Component {
    render() {
        const {
            value,
            onChange
        } = this.props;

        return (
            <div>
                <p>这个是个自定义组件。通过注册渲染器的方式实现。</p>

                <p>当前值：{value}</p>

                <a className="btn btn-default" onClick={() => onChange(Math.round(Math.random() * 10000))}>随机修改</a>
            </div>
        );
    }
}

@Renderer({
    test: /(^|\/)my\-renderer$/,
})
class CustomRenderer extends React.Component {
    render() {
        const  {tip} = this.props;
        return (
            <div>{tip || '非 FormItem 类型的渲染器注册， 这种不能修改 form'}</div>
        );
    }
}

export default {
    $schema: "https://houtai.baidu.com/v2/schemas/page.json#",
    title: "自定义组件示例",
    body: [
        {
            type: "form",
            mode: "horizontal",
            api: "/api/mock2/form/saveForm?waitSeconds=2",
            actions: [
                {
                    type: "submit",
                    label: "提交",
                    primary: true
                }
            ],
            controls: [
                {
                    name: 'a',
                    children: ({value, onChange}) => (
                        <div>
                            <p>这个是个自定义组件。最简单直接的方式，不用注册直接使用。</p>
    
                            <p>当前值：{value}</p>
    
                            <a className="btn btn-default" onClick={() => onChange(Math.round(Math.random() * 10000))}>随机修改</a>
                        </div>
                    )
                },
    
                {
                    type: 'divider'
                },
    
                {
                    name: 'b',
                    type: 'custom',
                    label: '自定义FormItem'
                },
    
                {
                    type: 'divider'
                },
    
                {
                    type: 'my-renderer'
                }
            ]
        },

        {
            type: 'my-renderer',
            tip: '他能放 controls 里面，也能放外面。'
        }
    ]
};
