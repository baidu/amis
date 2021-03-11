import React = require('react');
import {render} from 'react-testing-library';
import '../../src/themes/default';
import {
    render as amisRender
} from '../../src/index';
import { makeEnv } from '../helper';

test('Renderer:container', () => {
    const {
        container
    } = render(amisRender({
        type: 'page',
        body: {
            type: 'container',
            className: 'bg-white',
            body: [
                {
                    type: 'tpl',
                    tpl: '内容1'
                },
                {
                    type: 'plain',
                    tpl: '内容2'
                }
            ]
        }
    }, {}, makeEnv({
    })));

    expect(container).toMatchSnapshot();
});