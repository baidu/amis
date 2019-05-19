import {
    registerRenderer,
    unRegisterRenderer,
    RendererProps,
    render as amisRender
} from '../src/factory';
import React = require('react');
import {render, fireEvent, cleanup} from 'react-testing-library';
import { wait, makeEnv } from './helper';

test('factory unregistered Renderer', async () => {
    const {
        container,
    } = render(amisRender({
        type: 'my-renderer',
        a: 23
    }));
    await wait(100);
    expect(container).toMatchSnapshot(); // not found
});

test('factory custom not found!', async () => {
    const {
        container,
    } = render(amisRender({
        type: 'my-renderer',
        a: 23
    }, {}, makeEnv({
        loadRenderer: () => Promise.resolve(() => (<div>Not Found</div>))
    })));
    await wait(100);
    expect(container).toMatchSnapshot(); // not found
});

test('factory custom not found 2!', async () => {
    const {
        container,
    } = render(amisRender({
        type: 'my-renderer',
        a: 23
    }, {}, makeEnv({
        loadRenderer: () => () => (<div>Not Found</div>)
    })));
    await wait(100);
    expect(container).toMatchSnapshot(); // not found
});

test('factory custom not found 3!', async () => {
    const {
        container,
    } = render(amisRender({
        type: 'my-renderer',
        a: 23
    }, {}, makeEnv({
        loadRenderer: () => (<div>Not Found</div>)
    })));
    await wait(100);
    expect(container).toMatchSnapshot(); // not found
});

test('factory load Renderer on need', async () => {
    const {
        container,
    } = render(amisRender({
        type: 'my-renderer2',
        a: 23
    }, {}, makeEnv({
        session: 'loadRenderer',
        loadRenderer: (schema) => {
            interface MyProps extends RendererProps {
                a: number;
            };
        
            class MyComponent extends React.Component<MyProps> {
                render() {
                    return (<div>This is Custom Renderer2, a is {this.props.a}</div>);
                }
            }
        
            registerRenderer({
                component: MyComponent,
                test: /\bmy-renderer2$/
            });
        }
    })));
    await wait(100);
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