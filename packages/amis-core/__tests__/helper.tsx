import {waitFor} from '@testing-library/react';
import {RenderOptions} from '../src/factory';

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

// Mock IntersectionObserver
class IntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver
});
