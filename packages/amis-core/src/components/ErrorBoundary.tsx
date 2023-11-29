/**
 * @file ErrorBoundary
 * @description 捕获发生在其子组件树任何位置的 JavaScript 错误，并打印这些错误
 * @author wibetter
 */
import React from 'react';

interface ErrorBoundaryProps {
  // 自定义错误信息，控制台输出
  customErrorMsg?: string;
  fallback?: () => void;
  children: any;
}

interface ErrorBoundaryStates {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryStates
> {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error: any, errorInfo: any) {
    const {customErrorMsg} = this.props;
    if (customErrorMsg) {
      console.warn(customErrorMsg);
    }

    console.warn('错误对象：', error);
    console.warn('错误信息：', errorInfo);
    this.setState({
      hasError: true
    });
  }

  render() {
    const {fallback} = this.props;
    if (this.state.hasError) {
      if (fallback) {
        return fallback();
      }

      // 默认渲染错误信息
      return (
        <div className="renderer-error-boundary">
          渲染发生错误，详细错误信息请查看控制台输出。
        </div>
      );
    }

    return this.props.children;
  }
}
