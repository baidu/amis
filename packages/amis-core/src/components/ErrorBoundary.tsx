/**
 * @file ErrorBoundary
 * @description 捕获发生在其子组件树任何位置的 JavaScript 错误，并打印这些错误
 * @author wibetter
 */
import React from 'react';

interface ErrorBoundaryProps {
  curSchema?: any;
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
    const {curSchema} = this.props;
    if (curSchema) {
      console.warn(
        `拦截到${curSchema.type}渲染错误，当前组件schema:`,
        curSchema
      );
    }

    console.warn('错误对象：', error);
    console.warn('错误信息：', errorInfo);
    this.setState({
      hasError: true
    });
  }

  render() {
    const {curSchema} = this.props;
    if (this.state.hasError) {
      return (
        <div className="ae-Editor-renderer-error">
          {curSchema.type} 渲染发生错误，详细错误信息请查看控制台输出。
        </div>
      );
    }

    return this.props.children;
  }
}
