import React from 'react';
import GroupedSelection from '../GroupedSelection';
import Tabs, {Tab} from '../Tabs';
import TreeSelection from '../TreeSelection';
import type {VariableItem} from './Editor';

export interface VariableListProps {
  className?: string;
  data: Array<VariableItem>;
  selectMode?: 'list' | 'tree' | 'tabs';
  onSelect?: (item: VariableItem) => void;
}

export function VariableList({
  data: list,
  className,
  selectMode,
  onSelect
}: VariableListProps) {
  return (
    <div className={className}>
      {selectMode === 'tabs' ? (
        <Tabs tabsMode="radio">
          {list.map((item, index) => (
            <Tab eventKey={index} key={index} title={item.label}>
              <VariableList
                selectMode={item.selectMode}
                data={item.children!}
                onSelect={onSelect}
              />
            </Tab>
          ))}
        </Tabs>
      ) : selectMode === 'tree' ? (
        <TreeSelection
          multiple={false}
          options={list}
          onChange={(item: any) => onSelect?.(item)}
        />
      ) : (
        <GroupedSelection
          multiple={false}
          options={list}
          onChange={(item: any) => onSelect?.(item)}
        />
      )}
    </div>
  );
}
