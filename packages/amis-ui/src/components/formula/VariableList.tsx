import React, {useEffect} from 'react';

import {themeable, ThemeProps, filterTree, getTreeAncestors} from 'amis-core';
import GroupedSelection from '../GroupedSelection';
import Tabs, {Tab} from '../Tabs';
import TreeSelection from '../TreeSelection';
import SearchBox from '../SearchBox';

import type {VariableItem} from './Editor';
import type {ItemRenderStates} from '../Selection';
import type {Option} from '../Select';
import type {TabsMode} from '../Tabs';
import {Badge} from '../Badge';
import {SpinnerExtraProps} from '../Spinner';
import PopOverContainer from '../PopOverContainer';
import {matchSorter} from 'match-sorter';
import TooltipWrapper from '../TooltipWrapper';

// 数组成员读取
const memberOpers = [
  {
    label: '取该成员的记录',
    value: 'ARRAYMAP(${arr}, item => item.${member})'
  },
  {
    label: '取该成员的记录并过滤',
    value: 'ARRAYFILTER(${arr}, item => item.${member})'
  },
  {
    label: '取该成员列表记录中符合条件的总数',
    value: 'COUNT(ARRAYFILTER(${arr}, item => item.${member} === 条件))'
  },
  {
    label: '取该成员去重之后的总数',
    value: 'COUNT(UNIQ(${arr}, item.${member}))'
  },
  {
    label: '取该成员的总和',
    value: 'SUM(ARRAYMAP(${arr}, item => item.${member}))'
  },
  {
    label: '取该成员的平均值',
    value: 'AVG(ARRAYMAP(${arr}, item => item.${member}))'
  },
  {
    label: '取该成员的最大值',
    value: 'MAX(ARRAYMAP(${arr}, item => item.${member}))'
  },
  {
    label: '取该成员的最小值',
    value: 'MIN(ARRAYMAP(${arr}, item => item.${member}))'
  }
];

export interface VariableListProps extends ThemeProps, SpinnerExtraProps {
  className?: string;
  itemClassName?: string;
  value?: any;
  data: Array<VariableItem>;
  selectMode?: 'list' | 'tree' | 'tabs';
  tabsMode?: TabsMode;
  itemRender?: (option: Option, states: ItemRenderStates) => JSX.Element;
  placeholderRender?: (props: any) => JSX.Element | null;
  onSelect?: (item: VariableItem) => void;
  selfVariableName?: string;
  expandTree?: boolean;
}

function VariableList(props: VariableListProps) {
  const variableListRef = React.useRef<HTMLDivElement>(null);
  const {
    data: list,
    className,
    classnames: cx,
    tabsMode = 'line',
    classPrefix: themePrefix,
    itemClassName,
    selectMode,
    onSelect,
    placeholderRender,
    selfVariableName,
    expandTree
  } = props;
  const [filterVars, setFilterVars] = React.useState(list);
  const classPrefix = `${themePrefix}FormulaEditor-VariableList`;

  useEffect(() => {
    const {data} = props;
    if (data) {
      setFilterVars(data);
    }
  }, [props.data]);

  const itemRender =
    props.itemRender && typeof props.itemRender === 'function'
      ? props.itemRender
      : (option: Option, states: ItemRenderStates): JSX.Element => {
          return (
            <div>
              <div className={cx(`${classPrefix}-item`, itemClassName)}>
                {option.label &&
                  selfVariableName &&
                  option.value === selfVariableName && (
                    <Badge
                      classnames={cx}
                      badge={{
                        mode: 'text',
                        text: 'self',
                        offset: [15, 2]
                      }}
                    >
                      <label>{option.label}</label>
                    </Badge>
                  )}
                {option.label &&
                  (!selfVariableName || option.value !== selfVariableName) && (
                    <TooltipWrapper
                      tooltip={option.description ?? option.label}
                      tooltipTheme="dark"
                    >
                      <label>{option.label}</label>
                    </TooltipWrapper>
                  )}
                {/* 控制只对第一层数组成员展示快捷操作入口 */}
                {option.memberDepth < 2 ? (
                  <PopOverContainer
                    popOverContainer={() =>
                      document.querySelector(`.${cx('FormulaPicker-Modal')}`)
                    }
                    popOverRender={({onClose}) => (
                      <ul className={cx(`${classPrefix}-item-oper`)}>
                        {memberOpers.map((item, i) => {
                          return (
                            <li
                              key={i}
                              onClick={() =>
                                handleMemberClick(
                                  {...item, isMember: true},
                                  option,
                                  onClose
                                )
                              }
                            >
                              <span>{item.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  >
                    {({onClick, ref, isOpened}) => (
                      <i className="fa fa-ellipsis-h" onClick={onClick} />
                    )}
                  </PopOverContainer>
                ) : null}
                {option?.tag ? (
                  <span className={cx(`${classPrefix}-item-tag`)}>
                    {option.tag}
                  </span>
                ) : null}
              </div>
            </div>
          );
        };

  function handleMemberClick(item: any, option: any, onClose?: any) {
    // todo：暂时只提供一层的快捷操作
    const lastPointIdx = option.value.lastIndexOf('.');
    const arr = option.value.substring(0, lastPointIdx);
    const member = option.value.substring(lastPointIdx + 1);

    const value = item.value
      .replace('${arr}', arr)
      .replace('${member}', member);

    onClose?.();
    onSelect?.({
      ...item,
      label: value,
      value: value
    });
  }

  function onSearch(term: string) {
    const tree = filterTree(
      list,
      (i: any, key: number, level: number, paths: any[]) => {
        return !!(
          (Array.isArray(i.children) && i.children.length) ||
          !!matchSorter([i].concat(paths), term, {
            keys: ['label', 'value']
          }).length
        );
      },
      1,
      true
    );

    setFilterVars(!term ? list : tree);
  }

  function renderSearchBox() {
    return (
      <div className={cx('FormulaEditor-VariableList-searchBox')}>
        <SearchBox mini={false} onSearch={onSearch} useMobileUI />
      </div>
    );
  }

  function handleChange(item: any) {
    if (item.isMember) {
      return;
    }
    onSelect?.(item);
  }

  return (
    <div
      className={cx(
        className,
        'FormulaEditor-VariableList',
        selectMode && `FormulaEditor-VariableList-${selectMode}`
      )}
      ref={variableListRef}
    >
      {selectMode === 'tabs' ? (
        <Tabs
          tabsMode={tabsMode}
          className={cx(`${classPrefix}-base ${classPrefix}-tabs`)}
        >
          {filterVars.map((item, index) => (
            <Tab
              className={cx(`${classPrefix}-tab`)}
              eventKey={index}
              key={index}
              title={item.label}
            >
              <VariableList
                classnames={cx}
                classPrefix={`${classPrefix}-sub-`}
                className={cx(`${classPrefix}-sub`)}
                itemRender={itemRender}
                placeholderRender={placeholderRender}
                selectMode={item.selectMode}
                data={item.children!}
                onSelect={handleChange}
                selfVariableName={selfVariableName}
              />
            </Tab>
          ))}
        </Tabs>
      ) : selectMode === 'tree' ? (
        <div className={cx('FormulaEditor-VariableList-body')}>
          {renderSearchBox()}
          <TreeSelection
            itemRender={itemRender}
            placeholderRender={placeholderRender}
            className={cx(`${classPrefix}-base`, 'is-scrollable')}
            multiple={false}
            expand={expandTree ? 'all' : 'none'}
            options={filterVars}
            onChange={(item: any) => handleChange(item)}
          />
        </div>
      ) : (
        <div className={cx('FormulaEditor-VariableList-body')}>
          {renderSearchBox()}
          <GroupedSelection
            itemRender={itemRender}
            placeholderRender={placeholderRender}
            className={cx(`${classPrefix}-base`, 'is-scrollable')}
            multiple={false}
            options={filterVars}
            onChange={(item: any) => handleChange(item)}
          />
        </div>
      )}
    </div>
  );
}

export default themeable(VariableList);
