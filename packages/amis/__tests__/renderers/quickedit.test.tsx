/**
 * @file QuickEdit.test.tsx
 * @author xxx
 * @description QuickEdit组件单元测试，主要测试getQuickEditApi函数
 */

import {getQuickEditApi} from '../../src/renderers/QuickEdit';

describe('getQuickEditApi函数测试', () => {
  test('saveImmediately为true时返回quickSaveItemApi', () => {
    const quickSaveItemApi = '/api/save-item';
    const result = getQuickEditApi(true, quickSaveItemApi);
    expect(result).toBe(quickSaveItemApi);
  });

  test('saveImmediately为对象且包含api属性时返回saveImmediately.api', () => {
    const saveImmediately = {api: '/api/custom-save'};
    const quickSaveItemApi = '/api/save-item';
    const result = getQuickEditApi(saveImmediately, quickSaveItemApi);
    expect(result).toBe(saveImmediately.api);
  });

  test('saveImmediately不存在时,返回undefined', () => {
    expect(getQuickEditApi()).toBeUndefined();
  });
});
