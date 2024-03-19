/**
 * 所有对数据的改动都通过这里
 */

export interface ICommand {
  execute: () => void;
  undo: () => void;
}

export class ChangeRowHeightCommand implements ICommand {
  type: 'changeRowHeight';
  sheetIndex: string;
  row: number;
  height: number;
  oldHeight: number;
  constructor(
    sheetIndex: string,
    row: number,
    height: number,
    oldHeight: number
  ) {
    this.type = 'changeRowHeight';
    this.sheetIndex = sheetIndex;
    this.row = row;
    this.height = height;
    this.oldHeight = oldHeight;
  }
  execute() {
    // todo
  }
  undo() {
    // todo
  }
}

export class CommandManager {}
