/**
 * @file 用于浏览移动端下的效果，通过 postMessage 来被父容器控制
 */

import './polyfills/index';

import React from 'react';
import {render} from 'react-dom';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import {toast} from '../src/components/Toast';
import '../src/locale/en-US';

import {render as renderAmis} from '../src/index';

class AMISComponent extends React.Component {
  state = {
    schema: null,
    props: {}
  };
  constructor(props) {
    super(props);
    window.addEventListener('message', event => {
      const data = event.data;
      if (data && data.schema) {
        this.setState({schema: data.schema, props: data.props});
      }
    });
    window.parent.postMessage('amisReady', '*');
  }
  render() {
    return this.state.schema ? (
      <div>
        {renderAmis(this.state.schema, this.state.props, {
          fetcher: ({
            url, // 接口地址
            method, // 请求方法 get、post、put、delete
            data, // 请求数据
            responseType,
            config, // 其他配置
            headers // 请求头
          }: any) => {
            config = config || {};
            config.withCredentials = true;
            responseType && (config.responseType = responseType);

            if (config.cancelExecutor) {
              config.cancelToken = new (axios as any).CancelToken(
                config.cancelExecutor
              );
            }

            config.headers = headers || {};

            if (method !== 'post' && method !== 'put' && method !== 'patch') {
              if (data) {
                config.params = data;
              }

              return (axios as any)[method](url, config);
            } else if (data && data instanceof FormData) {
              config.headers = config.headers || {};
              config.headers['Content-Type'] = 'multipart/form-data';
            } else if (
              data &&
              typeof data !== 'string' &&
              !(data instanceof Blob) &&
              !(data instanceof ArrayBuffer)
            ) {
              data = JSON.stringify(data);
              config.headers = config.headers || {};
              config.headers['Content-Type'] = 'application/json';
            }

            return (axios as any)[method](url, data, config);
          },
          isCancel: (value: any) => (axios as any).isCancel(value),
          copy: content => {
            copy(content);
            toast.success('内容已复制到粘贴板');
          },
          affixOffsetTop: 0
        })}
      </div>
    ) : null;
  }
}

export function bootstrap(mountTo, initalState) {
  render(<AMISComponent />, mountTo);
}
