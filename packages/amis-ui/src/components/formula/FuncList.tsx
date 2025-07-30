import React from 'react';

import {mapTree, themeable, ThemeProps} from 'amis-core';
import Collapse from '../Collapse';
import CollapseGroup from '../CollapseGroup';
import SearchBox from '../SearchBox';
import type {FuncGroup, FuncItem} from './CodeEditor';
import TooltipWrapper from '../TooltipWrapper';
import {Icon} from '../icons';

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
    descClassName,
    mobileUI
  } = props;
  const [term, setTerm] = React.useState('');
  const [filteredFuncs, setFiteredFuncs] = React.useState(props.data);
  const [activeFunc, setActiveFunc] = React.useState<any>(null);

  const onSearch = React.useCallback(
    (term: string) => {
      term = term.trim();
      const filtered = props.data
        .map(item => {
          return {
            ...item,
            items: term
              ? item.items.filter(
                  (item: any) => ~item.name.indexOf(term.toUpperCase())
                )
              : item.items
          };
        })
        .filter(item => item.items.length);
      setFiteredFuncs(filtered);
    },
    [props.data]
  );

  React.useEffect(() => {
    onSearch(term);
  }, [props.data]);

  return (
    <div className={cx('FormulaEditor-panel', 'left', className)}>
      <div
        className={cx(
          'FormulaEditor-FuncList',
          activeFunc?.name ? 'withDoc' : ''
        )}
      >
        <div className={cx('FormulaEditor-panel-header')}>{title}</div>
        <div className={cx('FormulaEditor-panel-body')}>
          <div className={cx('FormulaEditor-FuncList-searchBox')}>
            <SearchBox
              value={term}
              onChange={setTerm}
              mini={false}
              onSearch={onSearch}
              mobileUI={mobileUI}
            />
          </div>
          <div className={cx('FormulaEditor-FuncList-body', bodyClassName)}>
            <CollapseGroup
              className={cx('FormulaEditor-FuncList-collapseGroup')}
              defaultActiveKey={filteredFuncs[0]?.groupName}
              expandIcon={
                <Icon
                  cx={cx}
                  icon="fa fa-chevron-right FormulaEditor-FuncList-expandIcon"
                  className="Icon"
                />
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
                  {item.items.map((item: any) => (
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
      {activeFunc?.name ? (
        <div className={cx('FormulaEditor-FuncDoc')}>
          <div className={cx('FormulaEditor-panel-header')}>
            {activeFunc?.name || ''}
          </div>
          <div className={cx('FormulaEditor-panel-body')}>
            <div className={cx('FormulaEditor-FuncList-doc', descClassName)}>
              {activeFunc ? (
                <>
                  {Array.isArray(activeFunc.params) ? (
                    <pre>
                      <TooltipWrapper
                        placement="top"
                        tooltip={{
                          children: () => (
                            <table
                              className={cx(
                                'FormulaEditor-FuncList-doc-example',
                                'Table-table'
                              )}
                            >
                              <thead>
                                <tr>
                                  {['参数名称', '类型', '描述'].map(
                                    (name, index) => (
                                      <th key={index}>{name}</th>
                                    )
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {activeFunc.params.map(
                                  (param: any, index: number) => (
                                    <tr key={index}>
                                      <td>{param.name}</td>
                                      <td>{param.type}</td>
                                      <td>{param.description}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          )
                        }}
                        trigger="hover"
                      >
                        <code>{activeFunc.example}</code>
                      </TooltipWrapper>
                    </pre>
                  ) : null}
                  <div className={cx('FormulaEditor-FuncList-doc-desc')}>
                    {activeFunc.description}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default themeable(FuncList);
