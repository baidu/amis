import React = require('react');
import PageRenderer from '../../../src/renderers/Form';
import * as renderer from 'react-test-renderer';
import {render, fireEvent, cleanup, getByText} from 'react-testing-library';
import '../../../src/themes/default';
import {
    render as amisRender
} from '../../../src/index';
import { makeEnv } from '../../helper';

test('Renderer:time', async () => {
    const {
        container
    } = render(amisRender({
        type: 'form',
        api: '/api/xxx',
        controls: [
            {
                type: 'time',
                name: 'a',
                label: 'time',
                value: '1559322060'
            }
        ],
        title: 'The form',
        actions: []
    }, {}, makeEnv({
    })));

    const input = container.querySelector('.a-DatePicker-value');
    expect(input.innerHTML).toEqual('01:01');

    expect(container).toMatchSnapshot();
});