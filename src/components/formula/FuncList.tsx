import React from 'react';
import {themeable, ThemeProps} from '../../theme';
import Collapse from '../Collapse';
import CollapseGroup from '../CollapseGroup';
import SearchBox from '../SearchBox';
import type {FuncGroup, FuncItem} from './Editor';

export interface FuncListProps extends ThemeProps {
  data: Array<FuncGroup>;
  onSelect?: (item: FuncItem) => void;
}

export function FuncList(props: FuncListProps) {
  const cx = props.classnames;
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
    <div className={cx('FormulaFuncList')}>
      <SearchBox
        className="FormulaFuncList-searchBox"
        mini={false}
        onSearch={onSearch}
      />
      <div className={cx('FormulaFuncList-columns')}>
        <CollapseGroup
          className="FormulaFuncList-group"
          defaultActiveKey={filteredFuncs[0]?.groupName}
          accordion
        >
          {filteredFuncs.map(item => (
            <Collapse
              headingClassName="FormulaFuncList-groupTitle"
              bodyClassName="FormulaFuncList-groupBody"
              propKey={item.groupName}
              header={item.groupName}
              key={item.groupName}
            >
              {item.items.map(item => (
                <div
                  className={cx(
                    `FormulaFuncList-funcItem ${
                      item.name === activeFunc?.name ? 'is-active' : ''
                    }`
                  )}
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
        <div className={cx('FormulaFuncList-column')}>
          {activeFunc ? (
            <div className={cx('FormulaFuncList-funcDetail')}>
              <pre>
                <code>{activeFunc.example}</code>
              </pre>
              <div>{activeFunc.description}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default themeable(FuncList);
