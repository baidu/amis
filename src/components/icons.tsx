/**
 * @file Icon
 * @description
 * @author fex
 */
import React from 'react';

import CloseIcon from '../icons/close.svg';
import StatusCloseIcon from '../icons/status-close.svg';
import UnDoIcon from '../icons/undo.svg';
import ReDoIcon from '../icons/redo.svg';
import EnterIcon from '../icons/enter.svg';
import VolumeIcon from '../icons/volume.svg';
import MuteIcon from '../icons/mute.svg';
import PlayIcon from '../icons/play.svg';
import PauseIcon from '../icons/pause.svg';
import LeftArrowIcon from '../icons/left-arrow.svg';
import RightArrowIcon from '../icons/right-arrow.svg';
import CheckIcon from '../icons/check.svg';
import PlusIcon from '../icons/plus.svg';
import MinusIcon from '../icons/minus.svg';
import PencilIcon from '../icons/pencil.svg';
import ViewIcon from '../icons/view.svg';
import RemoveIcon from '../icons/remove.svg';
import RetryIcon from '../icons/retry.svg';
import UploadIcon from '../icons/upload.svg';
import FileIcon from '../icons/file.svg';
import StatusSuccessIcon from '../icons/status-success.svg';
import StatusFailIcon from '../icons/status-fail.svg';
import StatusInfoIcon from '../icons/status-info.svg';
import StatusWarningIcon from '../icons/status-warning.svg';
import SuccessIcon from '../icons/success.svg';
import FailIcon from '../icons/fail.svg';
import SearchIcon from '../icons/search.svg';
import BackIcon from '../icons/back.svg';
import MoveIcon from '../icons/move.svg';
import InfoIcon from '../icons/info.svg';
import LocationIcon from '../icons/location.svg';
import DragBarIcon from '../icons/drag-bar.svg';
import ReloadIcon from '../icons/reload.svg';
import ExchangeIcon from '../icons/exchange.svg';
import ColmunsIcon from '../icons/columns.svg';
import CalendarIcon from '../icons/calendar.svg';
import ClockIcon from '../icons/clock.svg';

import CopyIcon from '../icons/copy.svg';
import FilterIcon from '../icons/filter.svg';
import CaretIcon from '../icons/caret.svg';
import RightArrowBoldIcon from '../icons/right-arrow-bold.svg';
import ColumnFilterIcon from '../icons/column-filter.svg';
import ZoomInIcon from '../icons/zoom-in.svg';
import ZoomOutIcon from '../icons/zoom-out.svg';
import QuestionIcon from '../icons/question.svg';
import QuestionMarkIcon from '../icons/question-mark.svg';
import WindowRestoreIcon from '../icons/window-restore.svg';
import InfoCircleIcon from '../icons/info-circle.svg';
import WarningIcon from '../icons/warning.svg';
import WarningMarkIcon from '../icons/warning-mark.svg';
import ScheduleIcon from '../icons/schedule.svg';
import HomeIcon from '../icons/home.svg';
import FolderIcon from '../icons/folder.svg';
import SortDefaultIcon from '../icons/sort-default.svg';
import SortAscIcon from '../icons/sort-asc.svg';
import SortDescIcon from '../icons/sort-desc.svg';
import SettingIcon from '../icons/setting.svg';
import PlusCicleIcon from '../icons/plus-cicle.svg';
import EllipsisVIcon from '../icons/ellipsis-v.svg';
import ExpandAltIcon from '../icons/expand-alt.svg';
import CompressAltIcon from '../icons/compress-alt.svg';
import TransparentIcon from '../icons/transparent.svg';
import LoadingOutline from '../icons/loading-outline.svg';

// 兼容原来的用法，后续不直接试用。

export const closeIcon = <CloseIcon />;
export const unDoIcon = <UnDoIcon />;
export const reDoIcon = <ReDoIcon />;
export const enterIcon = <EnterIcon />;
export const volumeIcon = <VolumeIcon />;
export const muteIcon = <MuteIcon />;
export const playIcon = <PlayIcon />;
export const pauseIcon = <PauseIcon />;
export const leftArrowIcon = <LeftArrowIcon />;
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
registerIcon('status-close', StatusCloseIcon);
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
registerIcon('status-success', StatusSuccessIcon);
registerIcon('status-fail', StatusFailIcon);
registerIcon('status-info', StatusInfoIcon);
registerIcon('status-warning', StatusWarningIcon);
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
registerIcon('clock', ClockIcon);
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
registerIcon('loading-outline', LoadingOutline);

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
