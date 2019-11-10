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
registerIcon('check', CheckIcon);
registerIcon('plus', PlusIcon);
registerIcon('minus', MinusIcon);
registerIcon('pencil', PencilIcon);
registerIcon('view', ViewIcon);
registerIcon('remove', RemoveIcon);
registerIcon('retry', RetryIcon);
registerIcon('upload', UploadIcon);
registerIcon('file', FileIcon);
registerIcon('success', SuccessIcon);
registerIcon('fail', FailIcon);
registerIcon('search', SearchIcon);

export function Icon({
  icon,
  ...rest
}: {
  icon: string;
} & React.ComponentProps<any>) {
  const Component = getIcon(icon);
  return Component ? (
    <Component {...rest} />
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
