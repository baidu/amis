export enum TabType {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
  BAR = 'bar',
  CLEAR = 'clear',
  DECIMAL = 'decimal',
  END = 'end',
  NUM = 'num',
  START = 'start'
}

export enum LeaderType {
  DOT = 'dot',
  HYPHEN = 'hyphen',
  MIDDLE_DOT = 'middleDot',
  NONE = 'none',
  UNDERSCORE = 'underscore'
}

export interface Tab {
  readonly type: TabType;
  readonly position: number;
  readonly leader?: LeaderType;
}
