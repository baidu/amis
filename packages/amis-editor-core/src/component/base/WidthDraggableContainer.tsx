import React from 'react';
import {WidthDraggableBtn} from './WidthDraggableBtn';

export default function (
  NeedWidthDraggableComp: React.ComponentType,
  isLeftDragIcon?: boolean
): React.ComponentType {
  return class WidthDraggableContainer extends React.Component {
    render() {
      return (
        <>
          <NeedWidthDraggableComp {...this.props} />
          <WidthDraggableBtn isLeftDragIcon={isLeftDragIcon} />
        </>
      );
    }
  };
}
