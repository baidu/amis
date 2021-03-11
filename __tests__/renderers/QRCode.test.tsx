import React = require('react');
import {render, fireEvent} from 'react-testing-library';
import '../../src/themes/default';
import {
    render as amisRender
} from '../../src/index';
import { makeEnv } from '../helper';
import 'jest-canvas-mock';

test('Renderer:qr-code', () => {
    const {
        container
    } = render(amisRender({
        type: 'page',
        body: {
            type: 'qr-code',
            value: 'amis'
        }
    }, {}, makeEnv({
    })));

    expect(container).toMatchSnapshot();
});