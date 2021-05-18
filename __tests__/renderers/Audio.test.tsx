import {render} from 'react-testing-library';
import {render as amisRender} from '../../src';
import {makeEnv} from '../helper';

beforeAll(() => {
  // jsdom not implemented: HTMLMediaElement.prototype.load
  // here: https://github.com/jsdom/jsdom/issues/1515
  Object.defineProperty(global.window.HTMLMediaElement.prototype, 'load', {
    get() {
      return () => {}
    }
  })
});

test('Renderer:alert', () => {
  const {container} = render(amisRender(
    {
      type: 'audio',
      src: '${url}'
    },
    {
      data: {
        url: 'https://example.com/music.mp3'
      }
    },
    makeEnv({})
  ));

  expect(container).toMatchSnapshot();
});
