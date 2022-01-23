import React from 'react';
import cx from 'classnames';

import GroupedSelection from '../GroupedSelection';
import Tabs, {Tab} from '../Tabs';
import TreeSelection from '../TreeSelection';

import type {VariableItem} from './Editor';
import type {ItemRenderStates} from '../Selection';
import type {Option} from '../Select';
import type {TabsMode} from '../Tabs';

export interface VariableListProps {
  className?: string;
  itemClassName?: string;
  classPrefix?: string;
  data: Array<VariableItem>;
  selectMode?: 'list' | 'tree' | 'tabs';
  tabsMode?: TabsMode;
  itemRender?: (option: Option, states: ItemRenderStates) => JSX.Element;
  onSelect?: (item: VariableItem) => void;
}

export function VariableList(props: VariableListProps) {
  const {
    data: list,
    className,
    tabsMode = 'card',
    classPrefix: themePrefix,
    itemClassName,
    selectMode,
    onSelect
  } = props;
  const classPrefix = `${themePrefix}FormulaEditor-VariableList`;
  const itemRender =
    props.itemRender && typeof props.itemRender === 'function'
      ? props.itemRender
      : (option: Option, states: ItemRenderStates): JSX.Element => {
          return (
            <span className={cx(`${classPrefix}-item`, itemClassName)}>
              <label>{option.label}</label>
              {option?.tag ? (
                <span className={cx(`${classPrefix}-item-tag`)}>
                  {option.tag}
                </span>
              ) : null}
            </span>
          );
        };

  return (
    <div className={cx(className, {'is-scrollable': selectMode !== 'tabs'})}>
      {selectMode === 'tabs' ? (
        <Tabs
          tabsMode={tabsMode}
          className={cx(`${classPrefix}-base ${classPrefix}-tabs`)}
        >
          {list.map((item, index) => (
            <Tab
              className={cx(`${classPrefix}-tab`)}
              eventKey={index}
              key={index}
              title={item.label}
            >
              <VariableList
                className={cx(`${classPrefix}-sub`)}
                itemRender={itemRender}
                selectMode={item.selectMode}
                data={item.children!}
                onSelect={onSelect}
              />
            </Tab>
          ))}
        </Tabs>
      ) : selectMode === 'tree' ? (
        <TreeSelection
          itemRender={itemRender}
          className={cx(`${classPrefix}-base`)}
          multiple={false}
          options={list}
          onChange={(item: any) => onSelect?.(item)}
        />
      ) : (
        <GroupedSelection
          itemRender={itemRender}
          className={cx(`${classPrefix}-base`)}
          multiple={false}
          options={list}
          onChange={(item: any) => onSelect?.(item)}
        />
      )}
    </div>
  );
}
