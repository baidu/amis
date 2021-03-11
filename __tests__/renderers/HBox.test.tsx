import React = require('react');
import {render} from 'react-testing-library';
import '../../src/themes/default';
import {
    render as amisRender
} from '../../src/index';
import { makeEnv } from '../helper';

test('Renderer:hbox', async () => {
    const {
        container
    } = render(amisRender({
        type: 'hbox',
        columns: [
            {
                type: 'tpl',
                tpl: 'w-xs',
                className: 'bg-info',
                inline: false,
                columnClassName: 'w-xs'
            },
            {
                type: 'tpl',
                tpl: 'w-sm',
                className: 'bg-info lter',
                inline: false,
                columnClassName: 'w-sm'
            },
            {
                type: 'tpl',
                tpl: 'w',
                className: 'bg-info dk',
                inline: false,
                columnClassName: 'w'
            },
            {
                type: 'tpl',
                tpl: '平均分配',
                className: 'bg-success',
                inline: false
            },
            {
                type: 'tpl',
                tpl: '平均分配',
                className: 'bg-primary',
                inline: false
            }
        ]
    }, {}, makeEnv({
    })));

    expect(container).toMatchSnapshot();
});