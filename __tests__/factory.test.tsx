import {
    registerRenderer,
    unRegisterRenderer,
    RendererProps,
    render as amisRender
} from '../src/factory';
import React = require('react');
import {render, fireEvent, cleanup} from 'react-testing-library';

test('factory unregistered Renderer', () => {
    const {
        container,
    } = render(amisRender({
        type: 'my-renderer',
        a: 23
    }));

    expect(container).toMatchSnapshot(); // not found
});

test('factory:registerRenderer', () => {
    interface MyProps extends RendererProps {
        a: number;
    };

    class MyComponent extends React.Component<MyProps> {
        render() {
            return (<div>This is Custom Renderer, a is {this.props.a}</div>);
        }
    }

    const renderer = registerRenderer({
        component: MyComponent,
        test: /\bmy-renderer$/
    });

    const {
        container
    } = render(amisRender({
        type: 'my-renderer',
        a: 23
    }))

    expect(container).toMatchSnapshot();
    unRegisterRenderer(renderer);
});