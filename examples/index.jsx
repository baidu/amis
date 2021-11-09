/**
 * @file entry of this example.
 * @author liaoxuezhi@cloud.com
 */
import './polyfills/index';
import React from 'react';
import {render} from 'react-dom';
import App from './components/App';

export function bootstrap(mountTo, initalState) {
  render(<App />, mountTo, () => {
    // 由于延迟加载导致初始锚点经常不正确
    // 延迟再设置一下锚点，这个问题暂时没想到其它方法
    setTimeout(() => {
      if (location.hash) {
        const hash = location.hash.split('#')[1];
        const anchor = document.querySelector(`a[name="${hash}"]`);
        if (anchor) {
          anchor.scrollIntoView();
        }
      }
    }, 5000);
  });
}
