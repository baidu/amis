import React from 'react';

import {flattenTree, filterTree, mapTree} from '../../src/utils/helper';

import DocNavCN from './DocNavCN';

export default class Doc extends React.PureComponent {
  state = {
    prevDoc: null,
    nextDoc: null
  };

  componentDidMount() {
    if (location.hash && location.hash.length > 1) {
      // 禁用自动跳转
      if (window.history && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      const dom = document.querySelector(
        `[name="${location.hash.substring(1)}"]`
      );
      dom && dom.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }

    this.props.setNavigations(DocNavCN);
    this.setDocFooter();
  }

  componentDidUpdate(preProps) {
    if (this.props.location.pathname !== preProps.location.pathname) {
      this.props.setNavigations(DocNavCN);
      this.setDocFooter();
    }
  }

  setDocFooter() {
    const newDocs = mapTree(DocNavCN, doc => ({
      ...doc,
      children:
        Array.isArray(doc.children) && doc.children.length
          ? doc.children.map(item => ({
              ...item,
              group: doc.group || doc.label
            }))
          : null
    }));
    const flattenDocs = flattenTree(newDocs).filter(i => !!i.path);
    const docIndex = flattenDocs.findIndex(
      d => `${this.props.ContextPath}${d.path}` === location.pathname
    );
    this.setState({
      prevDoc: flattenDocs[docIndex - 1],
      nextDoc: flattenDocs[docIndex + 1]
    });
  }

  render() {
    return (
      <>
        {React.cloneElement(this.props.children, {
          ...this.props.children.props,
          theme: this.props.theme,
          classPrefix: this.props.classPrefix,
          locale: this.props.locale,
          viewMode: this.props.viewMode,
          offScreen: this.props.offScreen,
          ContextPath: this.props.ContextPath,
          prevDoc: this.state.prevDoc,
          nextDoc: this.state.nextDoc
        })}
      </>
    );
  }
}
