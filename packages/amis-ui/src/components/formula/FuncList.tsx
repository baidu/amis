import React from 'react';

import {themeable, ThemeProps, generateIcon} from 'amis-core';
import Collapse from '../Collapse';
import CollapseGroup from '../CollapseGroup';
import SearchBox from '../SearchBox';
import type {FuncGroup, FuncItem} from './Editor';

export interface FuncListProps extends ThemeProps {
  title?: string;
  descClassName?: string;
  bodyClassName?: string;
  data: Array<FuncGroup>;
  onSelect?: (item: FuncItem) => void;
}

export function FuncList(props: FuncListProps) {
  const {
    title,
    className,
    classnames: cx,
    bodyClassName,
    descClassName
  } = props;
  const [filteredFuncs, setFiteredFuncs] = React.useState(props.data);
  const [activeFunc, setActiveFunc] = React.useState<any>(null);
  function onSearch(term: string) {
    const filtered = props.data
      .map(item => {
        return {
          ...item,
          items: term
            ? item.items.filter(item => ~item.name.indexOf(term.toUpperCase()))
            : item.items
        };
      })
      .filter(item => item.items.length);
    setFiteredFuncs(filtered);
  }

  return (
    <div className={cx('FormulaEditor-FuncList', className)}>
      <div className={cx('FormulaEditor-panel')}>
        <div className={cx('FormulaEditor-panel-header')}>{title}</div>
        <div className={cx('FormulaEditor-panel-body')}>
          <div className={cx('FormulaEditor-FuncList-searchBox')}>
            <SearchBox mini={false} onSearch={onSearch} />
          </div>
          <div className={cx('FormulaEditor-FuncList-body', bodyClassName)}>
            <CollapseGroup
              className={cx('FormulaEditor-FuncList-collapseGroup')}
              defaultActiveKey={filteredFuncs[0]?.groupName}
              expandIcon={
                generateIcon(
                  cx,
                  'fa fa-chevron-right FormulaEditor-FuncList-expandIcon',
                  'Icon'
                )!
              }
              accordion
            >
              {filteredFuncs.map(item => (
                <Collapse
                  className={cx('FormulaEditor-FuncList-collapse')}
                  headingClassName={cx('FormulaEditor-FuncList-groupTitle')}
                  bodyClassName={cx('FormulaEditor-FuncList-groupBody')}
                  propKey={item.groupName}
                  header={item.groupName}
                  key={item.groupName}
                >
                  {item.items.map(item => (
                    <div
                      className={cx('FormulaEditor-FuncList-item', {
                        'is-active': item.name === activeFunc?.name
                      })}
                      onMouseEnter={() => setActiveFunc(item)}
                      onClick={() => props.onSelect?.(item)}
                      key={item.name}
                    >
                      {item.name}
                    </div>
                  ))}
                </Collapse>
              ))}
            </CollapseGroup>
          </div>
        </div>
      </div>

      <div className={cx('FormulaEditor-panel')}>
        <div className={cx('FormulaEditor-panel-header')}>
          {activeFunc?.name || ''}
        </div>
        <div className={cx('FormulaEditor-panel-body')}>
          <div className={cx('FormulaEditor-FuncList-doc', descClassName)}>
            {activeFunc ? (
              <>
                <pre>
                  <code>{activeFunc.example}</code>
                </pre>
                <div className={cx('FormulaEditor-FuncList-doc-desc')}>
                  {activeFunc.description}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default themeable(FuncList);
