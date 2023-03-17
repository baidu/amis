import {waitFor} from '@testing-library/react';
import {RenderOptions} from '../src';

// jest.useFakeTimers 会修改 global 的 setTimeout 所以需要把原始的记录下来。
const timerFn = (global as any).originSetTimeout || setTimeout;
export function wait(duration: number, fnOrUseWaitFor?: Function | boolean) {
  const useWaitFor = fnOrUseWaitFor !== false;
  const fn = (
    typeof fnOrUseWaitFor === 'function' ? fnOrUseWaitFor : undefined
  ) as Function;

  return useWaitFor
    ? waitFor(
        () =>
          new Promise<void>(resolve => {
            timerFn(() => {
              fn && fn();
              resolve();
            }, duration);
          }),
        {
          timeout: duration + 100
        }
      )
    : new Promise<void>(resolve => {
        timerFn(() => {
          fn && fn();
          resolve();
        }, duration);
      });
}

export function makeEnv(env?: Partial<RenderOptions>): RenderOptions {
  return {
    session: 'test-case',
    isCancel: () => false,
    notify: (msg: string) => null,
    jumpTo: (to: string) => console.info('Now should jump to ' + to),
    alert: msg => console.info(`Alert: ${msg}`),
    ...env
  };
}

export const createMockMediaMatcher =
  (matchesOrMapOfMatches: any) => (qs: any) => ({
    matches:
      typeof matchesOrMapOfMatches === 'object'
        ? matchesOrMapOfMatches[qs]
        : matchesOrMapOfMatches,
    media: '',
    addListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    onchange: () => {},
    removeListener: () => {},
    dispatchEvent: () => {
      return true;
    }
  });

export function formatStyleObject(style: string | null, px2number = true) {
  if (!style) {
    return {};
  }

  // 去除注释 /* xx */
  style = style.replace(/\/\*[^(\*\/)]*\*\//g, '');

  const res: any = {};
  style.split(';').forEach((item: string) => {
    if (!item || !String(item).includes(':')) return;

    const [key, value] = item.split(':');

    res[String(key).trim()] =
      px2number && value.endsWith('px')
        ? Number(String(value).replace(/px$/, ''))
        : String(value).trim();
  });

  return res;
}
