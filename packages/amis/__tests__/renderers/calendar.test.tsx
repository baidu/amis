import React = require('react');
import {render} from '@testing-library/react';
import '../../src/themes/default';
import {render as amisRender} from '../../src/index';
import {makeEnv} from '../helper';

test('Renderer:calendar', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'calendar',
          value: '1638288000',
          schedules: [
            {
              startTime: '2021-12-11 05:14:00',
              endTime: '2021-12-11 06:14:00',
              content: '这是一个日程1'
            },
            {
              startTime: '2021-12-21 05:14:00',
              endTime: '2021-12-22 05:14:00',
              content: '这是一个日程2'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:calendar scheduleAction', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'calendar',
          value: '1638288000',
          schedules: [
            {
              startTime: '2021-12-11 05:14:00',
              endTime: '2021-12-11 06:14:00',
              content: '这是一个日程1'
            },
            {
              startTime: '2021-12-21 05:14:00',
              endTime: '2021-12-22 05:14:00',
              content: '这是一个日程2'
            }
          ],
          scheduleAction: {
            actionType: 'drawer',
            drawer: {
              title: '日程',
              body: {
                type: 'table',
                columns: [
                  {
                    name: 'time',
                    label: '时间'
                  },
                  {
                    name: 'content',
                    label: '内容'
                  }
                ],
                data: '${scheduleData}'
              }
            }
          }
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});

test('Renderer:calendar largeMode', () => {
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: {
          type: 'calendar',
          value: '1638288000',
          largeMode: true,
          schedules: [
            {
              startTime: '2021-12-11 05:14:00',
              endTime: '2021-12-11 06:14:00',
              content: '这是一个日程1'
            },
            {
              startTime: '2021-12-12 02:14:00',
              endTime: '2021-12-13 05:14:00',
              content: '这是一个日程2'
            },
            {
              startTime: '2021-12-20 05:14:00',
              endTime: '2021-12-21 05:14:00',
              content: '这是一个日程3'
            },
            {
              startTime: '2021-12-21 05:14:00',
              endTime: '2021-12-22 05:14:00',
              content: '这是一个日程4'
            },
            {
              startTime: '2021-12-22 02:14:00',
              endTime: '2021-12-23 05:14:00',
              content: '这是一个日程5'
            },
            {
              startTime: '2021-12-22 02:14:00',
              endTime: '2021-12-22 05:14:00',
              content: '这是一个日程6'
            },
            {
              startTime: '2021-12-22 02:14:00',
              endTime: '2021-12-22 05:14:00',
              content: '这是一个日程7'
            }
          ]
        }
      },
      {},
      makeEnv({})
    )
  );

  expect(container).toMatchSnapshot();
});
