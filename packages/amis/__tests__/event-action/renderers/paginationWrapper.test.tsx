import {fireEvent, render} from '@testing-library/react';
import '../../../src';
import {render as amisRender} from '../../../src';
import {makeEnv, wait} from '../../helper';

test('paginationWrapper: service + crud', async () => {
  const fetcher = jest.fn().mockImplementation(() =>
    Promise.resolve({
      data: {
        status: 0,
        data: {
          items: [
            {
              label: '110101',
              name: '东城区',
              sale: 46861
            },
            {
              label: '110102',
              name: '西城区',
              sale: 44882
            }
          ]
        }
      }
    })
  );
  const {container} = render(
    amisRender(
      {
        type: 'page',
        body: [
          {
            type: 'service',
            id: 'u:ff652047d747',
            api: {
              method: 'get',
              url: 'https://yapi.baidu-int.com/mock/42601/amis-chart/chart/sales/data2'
            },
            body: [
              {
                type: 'pagination-wrapper',
                body: [
                  {
                    type: 'crud',
                    source: '${items}',
                    columns: [
                      {
                        name: 'label',
                        label: '地区',
                        type: 'text',
                        id: 'u:331ab3342710'
                      },
                      {
                        name: 'sale',
                        label: '销售',
                        type: 'text',
                        id: 'u:3dba120eda1d'
                      }
                    ],
                    id: 'u:b3c77cb44fc8',
                    perPageAvailable: [10]
                  }
                ],
                inputName: 'items',
                outputName: 'items',
                perPage: 20,
                position: 'bottom'
              }
            ]
          }
        ]
      },
      {},
      makeEnv({
        fetcher
      })
    )
  );
  await wait(200);
  const tds = [].slice
    .call(container.querySelectorAll('tbody td'))
    .map((td: any) => td.textContent);
  expect(tds).toEqual(['110101', '46861', '110102', '44882']);
});
