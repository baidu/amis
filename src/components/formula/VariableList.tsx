import React from 'react';

import {themeable, ThemeProps} from '../../theme';
import GroupedSelection from '../GroupedSelection';
import Tabs, {Tab} from '../Tabs';
import TreeSelection from '../TreeSelection';
import SearchBox from '../SearchBox';
import {findTree} from '../../utils/helper';
import {Badge} from '../Badge';

import type {VariableItem} from './Editor';
import type {ItemRenderStates} from '../Selection';
import type {Option} from '../Select';
import type {TabsMode} from '../Tabs';

export interface VariableListProps extends ThemeProps {
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
}

function VariableList(props: VariableListProps) {
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
    selfVariableName
  } = props;
  const [filterVars, setFilterVars] = React.useState(list);
  const classPrefix = `${themePrefix}FormulaEditor-VariableList`;
  const itemRender =
    props.itemRender && typeof props.itemRender === 'function'
      ? props.itemRender
      : (option: Option, states: ItemRenderStates): JSX.Element => {
          return (
            <span className={cx(`${classPrefix}-item`, itemClassName)}>
              {
                  option.label && option.value === selfVariableName && (
                    <Badge
                      classnames={cx}
                      badge={{
                        mode: "text",
                        text: "self",
                        offset: [
                          15,
                          2
                        ]
                      }}
                    >
                      <label>
                        {option.label}
                      </label>
                    </Badge>
                  )
                }
                {
                  option.label && option.value !== selfVariableName && (
                    <label>
                        {option.label}
                      </label>
                  )
                }
              {option?.tag ? (
                <span className={cx(`${classPrefix}-item-tag`)}>
                  {option.tag}
                </span>
              ) : null}
            </span>
          );
        };

  function onSearch(term: string) {
    const tree = findTree(list, i => ~i.label.indexOf(term));
    setFilterVars(!term ? list : tree ? [tree] : list);
  }

  function renderSearchBox() {
    return (
      <div className={cx('FormulaEditor-VariableList-searchBox')}>
        <SearchBox mini={false} onSearch={onSearch} />
      </div>
    );
  }

  return (
    <div
      className={cx(
        className,
        'FormulaEditor-VariableList',
        selectMode && `FormulaEditor-VariableList-${selectMode}`
      )}
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
                onSelect={onSelect}
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
            options={filterVars}
            onChange={(item: any) => onSelect?.(item)}
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
            onChange={(item: any) => onSelect?.(item)}
          />
        </div>
      )}
    </div>
  );
}

export default themeable(VariableList);
