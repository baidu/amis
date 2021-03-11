import React = require('react');
import {render, fireEvent} from 'react-testing-library';
import '../../src/themes/default';
import {
    render as amisRender
} from '../../src/index';
import { makeEnv } from '../helper';

test('Renderer:dropdown-button', async () => {
    const {
        container
    } = render(amisRender({
        type: 'dropdown-button',
        level: 'primary',
        buttons: [
            {
                type: 'button',
                label: '按钮',
                actionType: 'dialog',
                dialog: {
                    title: '系统提示',
                    body: '对你点击了'
                }
            },
            {
                type: 'button',
                label: '按钮',
                actionType: 'dialog',
                dialog: {
                    title: '系统提示',
                    body: '对你点击了'
                }
            },
            {
                type: 'button',
                label: '按钮',
                visible: false
            }
        ],
        className: 'show'
    }, {}, makeEnv({
    })));

    const dropdowmButton = document.querySelector('button.a-Button');
    fireEvent.click(dropdowmButton as HTMLDivElement);
    expect(container).toMatchSnapshot();
    fireEvent.click(dropdowmButton as HTMLDivElement);
    expect(container).toMatchSnapshot();
});