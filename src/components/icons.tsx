/**
 * @file Icon
 * @description
 * @author fex
 */
import React from 'react';

// @ts-ignore
import CloseIcon from '../icons/close.svg';
// @ts-ignore
import UnDoIcon from '../icons/undo.svg';
// @ts-ignore
import ReDoIcon from '../icons/redo.svg';
// @ts-ignore
import EnterIcon from '../icons/enter.svg';
// @ts-ignore
import VolumeIcon from '../icons/volume.svg';
// @ts-ignore
import MuteIcon from '../icons/mute.svg';
// @ts-ignore
import PlayIcon from '../icons/play.svg';
// @ts-ignore
import PauseIcon from '../icons/pause.svg';
// @ts-ignore
import LeftArrowIcon from '../icons/left-arrow.svg';
// @ts-ignore
import RightArrowIcon from '../icons/right-arrow.svg';
// @ts-ignore
import CheckIcon from '../icons/check.svg';
// @ts-ignore
import PlusIcon from '../icons/plus.svg';
// @ts-ignore
import MinusIcon from '../icons/minus.svg';
// @ts-ignore
import PencilIcon from '../icons/pencil.svg';
// @ts-ignore
import ViewIcon from '../icons/view.svg';
// @ts-ignore
import RemoveIcon from '../icons/remove.svg';
// @ts-ignore
import RetryIcon from '../icons/retry.svg';
// @ts-ignore
import UploadIcon from '../icons/upload.svg';
// @ts-ignore
import FileIcon from '../icons/file.svg';
// @ts-ignore
import SuccessIcon from '../icons/success.svg';
// @ts-ignore
import FailIcon from '../icons/fail.svg';

// @ts-ignore
import SearchIcon from '../icons/search.svg';

// @ts-ignore
import BackIcon from '../icons/back.svg';

// @ts-ignore
import MoveIcon from '../icons/move.svg';

// @ts-ignore
import InfoIcon from '../icons/info.svg';

// @ts-ignore
import LocationIcon from '../icons/location.svg';

// @ts-ignore
import DragBarIcon from '../icons/drag-bar.svg';

// @ts-ignore
import ReloadIcon from '../icons/reload.svg';

// @ts-ignore
import ExchangeIcon from '../icons/exchange.svg';

// @ts-ignore
import ColmunsIcon from '../icons/columns.svg';

// @ts-ignore
import CalendarIcon from '../icons/calendar.svg';

// @ts-ignore
import CopyIcon from '../icons/copy.svg';

// @ts-ignore
import FilterIcon from '../icons/filter.svg';

// @ts-ignore
import CaretIcon from '../icons/caret.svg';

// @ts-ignore
import RightArrowBoldIcon from '../icons/right-arrow-bold.svg';

// @ts-ignore
import ColumnFilterIcon from '../icons/column-filter.svg';

// @ts-ignore
import ZoomInIcon from '../icons/zoom-in.svg';
// @ts-ignore
import ZoomOutIcon from '../icons/zoom-out.svg';

// @ts-ignore
import QuestionIcon from '../icons/question.svg';

// @ts-ignore
import QuestionMarkIcon from '../icons/question-mark.svg';

// @ts-ignore
import WindowRestoreIcon from '../icons/window-restore.svg';

// @ts-ignore
import InfoCircleIcon from '../icons/info-circle.svg';

// @ts-ignore
import WarningIcon from '../icons/warning.svg';

// @ts-ignore
import WarningMarkIcon from '../icons/warning-mark.svg';

// @ts-ignore
import ScheduleIcon from '../icons/schedule.svg';

// @ts-ignore
import HomeIcon from '../icons/home.svg';

// @ts-ignore
import FolderIcon from '../icons/folder.svg';

// @ts-ignore
import SortDefaultIcon from '../icons/sort-default.svg';

// @ts-ignore
import SortAscIcon from '../icons/sort-asc.svg';

// @ts-ignore
import SortDescIcon from '../icons/sort-desc.svg';

// @ts-ignore
import SettingIcon from '../icons/setting.svg';

// @ts-ignore
import PlusCicleIcon from '../icons/plus-cicle.svg';

// @ts-ignore
import EllipsisVIcon from '../icons/ellipsis-v.svg';

// @ts-ignore
import ExpandAltIcon from '../icons/expand-alt.svg';

// @ts-ignore
import CompressAltIcon from '../icons/compress-alt.svg';

// @ts-ignore
import TransparentIcon from '../icons/transparent.svg';

// 兼容原来的用法，后续不直接试用。
// @ts-ignore
export const closeIcon = <CloseIcon />;
// @ts-ignore
export const unDoIcon = <UnDoIcon />;
// @ts-ignore
export const reDoIcon = <ReDoIcon />;
// @ts-ignore
export const enterIcon = <EnterIcon />;
// @ts-ignore
export const volumeIcon = <VolumeIcon />;
// @ts-ignore
export const muteIcon = <MuteIcon />;
// @ts-ignore
export const playIcon = <PlayIcon />;
// @ts-ignore
export const pauseIcon = <PauseIcon />;
// @ts-ignore
export const leftArrowIcon = <LeftArrowIcon />;
// @ts-ignore
export const rightArrowIcon = <RightArrowIcon />;

const iconFactory: {
  [propName: string]: React.ReactType<{}>;
} = {};

export function getIcon(key: string) {
  return iconFactory[key];
}

export function hasIcon(iconName: string) {
  return !!getIcon(iconName);
}

export function registerIcon(key: string, component: React.ReactType<{}>) {
  iconFactory[key] = component;
}

registerIcon('close', CloseIcon);
registerIcon('undo', UnDoIcon);
registerIcon('redo', ReDoIcon);
registerIcon('enter', EnterIcon);
registerIcon('volume', VolumeIcon);
registerIcon('mute', MuteIcon);
registerIcon('play', PlayIcon);
registerIcon('pause', PauseIcon);
registerIcon('left-arrow', LeftArrowIcon);
registerIcon('right-arrow', RightArrowIcon);
registerIcon('prev', LeftArrowIcon);
registerIcon('next', RightArrowIcon);
registerIcon('check', CheckIcon);
registerIcon('plus', PlusIcon);
registerIcon('add', PlusIcon);
registerIcon('minus', MinusIcon);
registerIcon('pencil', PencilIcon);
registerIcon('view', ViewIcon);
registerIcon('remove', RemoveIcon);
registerIcon('retry', RetryIcon);
registerIcon('upload', UploadIcon);
registerIcon('file', FileIcon);
registerIcon('success', SuccessIcon);
registerIcon('fail', FailIcon);
registerIcon('warning', WarningIcon);
registerIcon('warning-mark', WarningMarkIcon);
registerIcon('search', SearchIcon);
registerIcon('back', BackIcon);
registerIcon('move', MoveIcon);
registerIcon('info', InfoIcon);
registerIcon('info-circle', InfoCircleIcon);
registerIcon('location', LocationIcon);
registerIcon('drag-bar', DragBarIcon);
registerIcon('reload', ReloadIcon);
registerIcon('exchange', ExchangeIcon);
registerIcon('columns', ColmunsIcon);
registerIcon('calendar', CalendarIcon);
registerIcon('copy', CopyIcon);
registerIcon('filter', FilterIcon);
registerIcon('column-filter', ColumnFilterIcon);
registerIcon('caret', CaretIcon);
registerIcon('right-arrow-bold', RightArrowBoldIcon);
registerIcon('zoom-in', ZoomInIcon);
registerIcon('zoom-out', ZoomOutIcon);
registerIcon('question', QuestionIcon);
registerIcon('question-mark', QuestionMarkIcon);
registerIcon('window-restore', WindowRestoreIcon);
registerIcon('schedule', ScheduleIcon);
registerIcon('home', HomeIcon);
registerIcon('folder', FolderIcon);
registerIcon('sort-default', SortDefaultIcon);
registerIcon('sort-asc', SortAscIcon);
registerIcon('sort-desc', SortDescIcon);
registerIcon('setting', SettingIcon);
registerIcon('plus-cicle', PlusCicleIcon);
registerIcon('ellipsis-v', EllipsisVIcon);
registerIcon('expand-alt', ExpandAltIcon);
registerIcon('compress-alt', CompressAltIcon);
registerIcon('transparent', TransparentIcon);

export function Icon({
  icon,
  className,
  ...rest
}: {
  icon: string;
} & React.ComponentProps<any>) {
  // jest 运行环境下，把指定的 icon 也输出到 snapshot 中。
  if (typeof jest !== 'undefined') {
    rest.icon = icon;
  }

  const Component = getIcon(icon);
  return Component ? (
    <Component {...rest} className={`${className || ''} icon-${icon}`} />
  ) : (
    <span className="text-danger">没有 icon {icon}</span>
  );
}

export {
  CloseIcon,
  UnDoIcon,
  ReDoIcon,
  EnterIcon,
  VolumeIcon,
  MuteIcon,
  PlayIcon,
  PauseIcon,
  LeftArrowIcon,
  RightArrowIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon
};
