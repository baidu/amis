/**
 * @file 用于浏览移动端下的效果，通过 postMessage 来被父容器控制
 */

import './polyfills/index';

import React from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import copy from 'copy-to-clipboard';
import {toast} from 'amis';
import 'amis/lib/locale/en-US';

import {render as renderAmis} from 'amis';

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
        this.setState({
          schema: data.schema,
          props: data.props
        });
      }
    });
    window.parent.postMessage('amisReady', '*');
  }
  render() {
    return this.state.schema ? (
      <div>
        {renderAmis(this.state.schema, this.state.props, {
          fetcher: async ({
            url, // 接口地址
            method, // 请求方法 get、post、put、delete
            data, // 请求数据
            responseType,
            config, // 其他配置
            headers // 请求头
          }) => {
            config = {
              url,
              dataType: 'json',
              method,
              data,
              headers,
              responseType,
              ...config
            };

            if (config.dataType === 'json' && config.data) {
              config.data = JSON.stringify(config.data);
              config.headers = config.headers || {};
              config.headers['Content-Type'] = 'application/json';
            }

            // 支持返回各种报错信息
            config.validateStatus = function () {
              return true;
            };
            const response = await axios(config);

            if (response.status >= 400) {
              if (response.data) {
                if (response.data.msg) {
                  throw new Error(response.data.msg);
                } else {
                  throw new Error(
                    '接口报错：' + JSON.stringify(response.data, null, 2)
                  );
                }
              } else {
                throw new Error(`接口出错，状态码是 ${response.status}`);
              }
            }
            return response;
          },
          isCancel: value => axios.isCancel(value),
          copy: (content, optinos) => {
            copy(content, optinos);
            toast.success('内容已复制到粘贴板');
          },
          tracker(eventTrack) {
            console.debug('eventTrack', eventTrack);
          }
        })}
      </div>
    ) : null;
  }
}

export function bootstrap(mountTo) {
  const root = createRoot(mountTo);
  root.render(<AMISComponent />);
}
