import React = require('react');
import {render, cleanup} from 'react-testing-library';
import '../../../src/themes/default';
import {
    render as amisRender
} from '../../../src/index';
import {makeEnv} from '../../helper';
import { clearStoresCache } from '../../../src/factory';

afterEach(() => {
    cleanup();
    clearStoresCache();
});

test('Renderer:hbox', async () => {
    const {
        container
    } = render(amisRender({
        type: 'form',
        title: 'The form',
        controls: [
            {
                type: 'hbox',
                columns: [
                    {
                        columnClassName: 'w-sm',
                        controls: [
                            {
                                name: 'text',
                                type: 'text',
                                label: false,
                                placeholder: 'Text'
                            }
                        ]
                    },
                    {
                        type: 'tpl',
                        tpl: '其他类型的渲染器'
                    }
                ]
            }
        ],
        submitText: null,
        actions: []
    }, {}, makeEnv()));
    expect(container).toMatchSnapshot();
});