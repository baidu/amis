import React, {useEffect} from 'react';

import {themeable, ThemeProps, filterTree, mapTree} from 'amis-core';
import GroupedSelection from '../GroupedSelection';
import Tabs, {Tab} from '../Tabs';
import TreeSelection from '../TreeSelection';
import SearchBox from '../SearchBox';
import {Icon} from '../icons';

import type {VariableItem} from './CodeEditor';
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
    label: '取列值',
    value: 'ARRAYMAP(${arr}, item => item.${member})',
    description: '取当前列的所有值（数组）'
  },
  {
    label: '取条件值',
    value:
      'ARRAYFILTER(ARRAYMAP(${arr}, item => item.${member}), item => item === 条件)',
    description: '取当前列中符合配置条件的值（数组）'
  },
  {
    label: '取表值',
    value: 'ARRAYFILTER(${arr}, item => item.${member} === 条件)',
    description: '取列表中符合配置条件的值（数组）'
  },
  {
    label: '计数',
    value: 'COUNT(ARRAYFILTER(${arr}, item => item.${member} === 条件))',
    description: '统计表中符合配置条件的值的总数'
  },
  {
    label: '去重计数',
    value: 'COUNT(UNIQ(${arr}, item.${member}))',
    description: '对表中当前值进行去重，并统计去重后的值的数量',
    simple: true
  },
  {
    label: '求和',
    value: 'SUM(ARRAYMAP(${arr}, item => item.${member}))',
    description: '求当前列的所有值之和',
    simple: true
  },
  {
    label: '平均值',
    value: 'AVG(ARRAYMAP(${arr}, item => item.${member}))',
    description: '求当前列的平均值',
    simple: true
  },
  {
    label: '最大值',
    value: 'MAX(ARRAYMAP(${arr}, item => item.${member}))',
    description: '取当前列的最大值',
    simple: true
  },
  {
    label: '最小值',
    value: 'MIN(ARRAYMAP(${arr}, item => item.${member}))',
    description: '取当前列的最小值',
    simple: true
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
  simplifyMemberOprs?: boolean;
  popOverContainer?: () => HTMLElement;
}

function VariableList(props: VariableListProps) {
  const variableListRef = React.useRef<HTMLDivElement>(null);
  const {
    className,
    classnames: cx,
    tabsMode = 'line',
    classPrefix: themePrefix,
    itemClassName,
    selectMode,
    onSelect,
    placeholderRender,
    selfVariableName,
    expandTree,
    simplifyMemberOprs,
    popOverContainer
  } = props;
  const [variables, setVariables] = React.useState<Array<VariableItem>>([]);
  const [filterVars, setFilterVars] = React.useState<Array<VariableItem>>([]);
  const classPrefix = `${themePrefix}FormulaEditor-VariableList`;

  React.useEffect(() => {
    // 追加path，用于分级高亮
    const list = mapTree(
      props.data,
      (item: any, key: number, level: number, paths: any[]) => {
        const path = paths?.reduce((prev, item) => {
          return !item.value
            ? prev
            : `${prev}${prev ? '.' : ''}${item.label ?? item.value}`;
        }, '');

        return {
          ...item,
          path: `${path}${path ? '.' : ''}${item.label}`,
          // 自己是数组成员或者父级有数组成员
          ...(item.isMember || paths.some(item => item.isMember)
            ? {
                memberDepth: paths?.filter((item: any) => item.type === 'array')
                  ?.length
              }
            : {})
        };
      }
    );

    setVariables(list);
    setFilterVars(list);
  }, [props.data]);

  const itemRender =
    props.itemRender && typeof props.itemRender === 'function'
      ? props.itemRender
      : (option: Option, states: ItemRenderStates): JSX.Element => {
          return (
            <div key={states.index}>
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
                {option.memberDepth === undefined &&
                  option.label &&
                  (!selfVariableName || option.value !== selfVariableName) && (
                    <TooltipWrapper
                      tooltip={option.description ?? option.label}
                      tooltipTheme="dark"
                    >
                      <label>{option.label}</label>
                    </TooltipWrapper>
                  )}
                {/* 控制只对第一层数组成员展示快捷操作入口 */}
                {option.memberDepth !== undefined &&
                option.label &&
                (!selfVariableName || option.value !== selfVariableName) ? (
                  option.memberDepth < 2 ? (
                    <PopOverContainer
                      popOverContainer={
                        popOverContainer ||
                        (() =>
                          document.querySelector(
                            `.${cx('FormulaPicker-Modal')}`
                          ))
                      }
                      popOverRender={({onClose}) => (
                        <ul className={cx(`${classPrefix}-item-oper`)}>
                          {memberOpers
                            .filter(item => !simplifyMemberOprs || item.simple)
                            .map((item, i) => {
                              return (
                                <TooltipWrapper
                                  key={i}
                                  tooltip={item.description}
                                  tooltipTheme="dark"
                                >
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
                                </TooltipWrapper>
                              );
                            })}
                        </ul>
                      )}
                    >
                      {({onClick, ref, isOpened}) => (
                        <TooltipWrapper
                          tooltip={option.description ?? option.label}
                          tooltipTheme="dark"
                        >
                          <>
                            <label onClick={onClick}>{option.label}</label>
                            <Icon
                              onClick={onClick}
                              icon="ellipsis-v"
                              className="icon"
                            />
                          </>
                        </TooltipWrapper>
                      )}
                    </PopOverContainer>
                  ) : (
                    <label>{option.label}</label>
                  )
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
    // const firstPointIdx = option.value.indexOf('.');
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
    term = term.trim();
    const tree = filterTree(
      variables,
      (i: any, key: number, level: number, paths: any[]) => {
        return !!(
          (Array.isArray(i.children) && i.children.length) ||
          !!matchSorter([i].concat(paths), term, {
            keys: ['label', 'value'],
            threshold: matchSorter.rankings.CONTAINS
          }).length
        );
      },
      1,
      true
    );

    setFilterVars(!term ? variables : tree);
  }

  function renderSearchBox() {
    return (
      <div className={cx('FormulaEditor-VariableList-searchBox')}>
        <SearchBox mini={false} onSearch={onSearch} mobileUI={props.mobileUI} />
      </div>
    );
  }

  function handleChange(item: any) {
    // 允许所有有 value 的元素被点击插入
    // 注释掉原来的阻止逻辑，允许 isMember 元素直接点击
    // if (item.isMember || item.memberDepth !== undefined) {
    //   return;
    // }
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
