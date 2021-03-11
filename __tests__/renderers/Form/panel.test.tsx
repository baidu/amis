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

test('Renderer:panel', async () => {
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
                        controls: [
                            {
                                type: 'panel',
                                title: 'bla bla',
                                bodyClassName: 'bg-white',
                                body: [
                                    {
                                        name: 'text',
                                        type: 'text',
                                        label: false,
                                        placeholder: 'Text'
                                    }
                                ],
                                footer: '<p>footer 内容</p>',
                                footerClassName: 'bg-black'
                            }
                        ]
                    },
                    {
                        controls: [
                            {
                                type: 'panel',
                                title: 'bla bla',
                                controls: [
                                    {
                                        name: 'text',
                                        type: 'text',
                                        label: false,
                                        placeholder: 'Text 1'
                                    },
                                    {
                                        name: 'text2',
                                        type: 'text',
                                        label: false,
                                        placeholder: 'Text 2'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        submitText: null,
        actions: []
    }, {}, makeEnv()));
    expect(container).toMatchSnapshot();
});