import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:flex', () => {
  const {container} = render(
    amisRender(
      {
        type: 'flex',
        items: [
          {
            style: {
              backgroundColor: '#1A5CFF',
              width: 100,
              height: 50,
              margin: 5
            },
            type: 'tpl',
            tpl: ''
          },
          {
            style: {
              backgroundColor: '#46C93A',
              width: 100,
              height: 50,
              margin: 5
            },
            type: 'tpl',
            tpl: ''
          },
          {
            style: {
              backgroundColor: '#FF4757',
              width: 100,
              height: 50,
              margin: 5
            },
            type: 'tpl',
            tpl: ''
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:flex justify', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          'center',
          {
            type: 'flex',
            justify: 'center',
            items: [
              {
                style: {
                  backgroundColor: '#1A5CFF',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#46C93A',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#FF4757',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              }
            ]
          },
          'flex-start',
          {
            type: 'flex',
            justify: 'flex-start',
            items: [
              {
                style: {
                  backgroundColor: '#1A5CFF',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#46C93A',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#FF4757',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              }
            ]
          },
          'flex-end',
          {
            type: 'flex',
            justify: 'flex-end',
            items: [
              {
                style: {
                  backgroundColor: '#1A5CFF',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#46C93A',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#FF4757',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              }
            ]
          },
          'space-around',
          {
            type: 'flex',
            justify: 'space-around',
            items: [
              {
                style: {
                  backgroundColor: '#1A5CFF',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                width: 100,
                height: 30,
                style: {
                  backgroundColor: '#46C93A',
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#FF4757',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              }
            ]
          },
          'space-between',
          {
            type: 'flex',
            justify: 'space-between',
            items: [
              {
                style: {
                  backgroundColor: '#1A5CFF',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#46C93A',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#FF4757',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              }
            ]
          },
          'space-evenly',
          {
            type: 'flex',
            justify: 'space-evenly',
            items: [
              {
                style: {
                  backgroundColor: '#1A5CFF',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#46C93A',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              },
              {
                style: {
                  backgroundColor: '#FF4757',
                  width: 100,
                  height: 30,
                  margin: 5
                },
                type: 'tpl',
                tpl: ''
              }
            ]
          }
        ]
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
