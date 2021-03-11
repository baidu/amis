import React = require('react');
import {render, cleanup, fireEvent} from 'react-testing-library';
import '../../../src/themes/default';
import {
    render as amisRender
} from '../../../src/index';
import {makeEnv, wait} from '../../helper';
import { clearStoresCache } from '../../../src/factory';

afterEach(() => {
    cleanup();
    clearStoresCache();
});

test('Renderer:list', async () => {
    const {
        container
    } = render(amisRender({
        type: 'form',
        title: 'The form',
        controls: [
            {
                type: 'list',
                name: 'select',
                label: '单选',
                clearable: true,
                options: [
                    {
                        label: 'Option A',
                        value: 'a'
                    },
                    {
                        label: 'Option B',
                        value: 'b'
                    },
                    {
                        label: 'OptionC',
                        value: 'c',
                        image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
                    }
                ]
            }
        ],
        submitText: null,
        actions: []
    }, {}, makeEnv()));
    expect(container).toMatchSnapshot();
});

test('Renderer:list:multiple clearable', async () => {
    const {
        getByText,
        container
    } = render(amisRender({
        type: 'form',
        title: 'The form',
        controls: [
            {
                type: 'list',
                name: 'select',
                label: '多选',
                multiple: true,
                clearable: true,
                options: [
                    {
                        label: 'Option A',
                        value: 'a'
                    },
                    {
                        label: 'Option B',
                        value: 'b'
                    }
                ]
            },
            {
                type: 'static',
                name: 'select',
                label: '当前值'
            }
        ],
        submitText: null,
        actions: []
    }, {}, makeEnv()));
    await wait(100);
    fireEvent.click(getByText(/Option A/));
    await wait(100);
    fireEvent.click(getByText(/Option B/));
    expect(container).toMatchSnapshot();
    await wait(100);
    fireEvent.click(getByText(/Option B/));
    await wait(100);
    expect(container).toMatchSnapshot();
});