/**
 * @file Icon
 * @description
 * @author fex
 */
import React, {createElement, useEffect, useMemo} from 'react';
import cxClass from 'classnames';
import CloseIcon from '../icons/close.svg';
import CloseSmallIcon from '../icons/close-small.svg';
import StatusCloseIcon from '../icons/status-close.svg';
import UnDoIcon from '../icons/undo.svg';
import UnDoNormalIcon from '../icons/undo-normal.svg';
import ReDoIcon from '../icons/redo.svg';
import EnterIcon from '../icons/enter.svg';
import VolumeIcon from '../icons/volume.svg';
import MuteIcon from '../icons/mute.svg';
import PlayIcon from '../icons/play.svg';
import PauseIcon from '../icons/pause.svg';
import LeftArrowIcon from '../icons/left-arrow.svg';
import RightArrowIcon from '../icons/right-arrow.svg';
import ArrowDoubleLeftIcon from '../icons/arrow-double-left.svg';
import ArrowDoubleRightIcon from '../icons/arrow-double-right.svg';
import CheckIcon from '../icons/check.svg';
import PlusIcon from '../icons/plus.svg';
import SubPlusIcon from '../icons/sub-plus.svg';
import MinusIcon from '../icons/minus.svg';
import PencilIcon from '../icons/pencil.svg';
import ViewIcon from '../icons/view.svg';
import RemoveIcon from '../icons/remove.svg';
import RetryIcon from '../icons/retry.svg';
import UploadIcon from '../icons/upload.svg';
import DownloadIcon from '../icons/download.svg';
import FileIcon from '../icons/file.svg';
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
import TreeDownIcon from '../icons/tree-down.svg';
import CloudUploadIcon from '../icons/cloud-upload.svg';
import ImageIcon from '../icons/image.svg';
import RefreshIcon from '../icons/refresh.svg';
import DragIcon from '../icons/drag.svg';
import EditIcon from '../icons/edit.svg';
import DeskEmptyIcon from '../icons/desk-empty.svg';
import FullScreen from '../icons/fullscreen.svg';
import UnFullscreen from '../icons/unfullscreen.svg';

import CopyIcon from '../icons/copy.svg';
import FilterIcon from '../icons/filter.svg';
import CaretIcon from '../icons/caret.svg';
import RightArrowBoldIcon from '../icons/right-arrow-bold.svg';
import DownArrowBoldIcon from '../icons/down-arrow-bold.svg';
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
import PlusFineIcon from '../icons/plus-fine.svg';
import EllipsisVIcon from '../icons/ellipsis-v.svg';
import ExpandAltIcon from '../icons/expand-alt.svg';
import CompressAltIcon from '../icons/compress-alt.svg';
import TransparentIcon from '../icons/transparent.svg';
import LoadingOutline from '../icons/loading-outline.svg';
import Star from '../icons/star.svg';
import AlertSuccess from '../icons/alert-success.svg';
import AlertInfo from '../icons/alert-info.svg';
import AlertWarning from '../icons/alert-warning.svg';
import AlertDanger from '../icons/alert-danger.svg';
import FunctionIcon from '../icons/function.svg';
import InputClearIcon from '../icons/input-clear.svg';
import SliderHandleIcon from '../icons/slider-handle-icon.svg';
import TrashIcon from '../icons/trash.svg';
import MenuIcon from '../icons/menu.svg';
import UserRemove from '../icons/user-remove.svg';
import Role from '../icons/role.svg';
import Department from '../icons/department.svg';
import Post from '../icons/post.svg';
import DotIcon from '../icons/dot.svg';
import StepsFinsh from '../icons/steps-finsh.svg';
import Invisible from '../icons/invisible.svg';
import DateIcon from '../icons/date.svg';
import InvisibleIcon from '../icons/invisible.svg';
import DownIcon from '../icons/down.svg';
import RightDoubleArrowIcon from '../icons/right-double-arrow.svg';
import NewEdit from '../icons/new-edit.svg';
import RotateLeft from '../icons/rotate-left.svg';
import RotateRight from '../icons/rotate-right.svg';
import ScaleOrigin from '../icons/scale-origin.svg';
import If from '../icons/if.svg';
import RotateScreen from '../icons/rotate-screen.svg';

import isObject from 'lodash/isObject';
import {
  type CustomVendorFn,
  getCustomVendor,
  type TestIdBuilder
} from 'amis-core';

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
  [propName: string]: React.ElementType<{}>;
} = {};

export function getIconNames() {
  return Object.keys(iconFactory);
}

export function getIcon(key: string) {
  return iconFactory[key];
}

export function hasIcon(iconName: string) {
  return !!getIcon(iconName);
}

export function registerIcon(key: string, component: React.ElementType<{}>) {
  iconFactory[key] = component;
}

registerIcon('close', CloseIcon);
registerIcon('close-small', CloseSmallIcon);
registerIcon('status-close', StatusCloseIcon);
registerIcon('undo', UnDoIcon);
registerIcon('undo-normal', UnDoNormalIcon);
registerIcon('full-screen', FullScreen);
registerIcon('un-fullscreen', UnFullscreen);
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
registerIcon('sub-plus', SubPlusIcon);
registerIcon('add', PlusIcon);
registerIcon('minus', MinusIcon);
registerIcon('pencil', PencilIcon);
registerIcon('view', ViewIcon);
registerIcon('remove', RemoveIcon);
registerIcon('retry', RetryIcon);
registerIcon('upload', UploadIcon);
registerIcon('download', DownloadIcon);
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
registerIcon('clock', ClockIcon);
registerIcon('copy', CopyIcon);
registerIcon('filter', FilterIcon);
registerIcon('column-filter', ColumnFilterIcon);
registerIcon('caret', CaretIcon);
registerIcon('right-arrow-bold', RightArrowBoldIcon);
registerIcon('down-arrow-bold', DownArrowBoldIcon);
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
registerIcon('star', Star);
registerIcon('alert-success', AlertSuccess);
registerIcon('alert-info', AlertInfo);
registerIcon('alert-warning', AlertWarning);
registerIcon('alert-danger', AlertDanger);
registerIcon('alert-fail', AlertDanger);
registerIcon('tree-down', TreeDownIcon);
registerIcon('function', FunctionIcon);
registerIcon('input-clear', InputClearIcon);
registerIcon('slider-handle', SliderHandleIcon);
registerIcon('cloud-upload', CloudUploadIcon);
registerIcon('image', ImageIcon);
registerIcon('refresh', RefreshIcon);
registerIcon('trash', TrashIcon);
registerIcon('menu', MenuIcon);
registerIcon('user-remove', UserRemove);
registerIcon('role', Role);
registerIcon('department', Department);
registerIcon('post', Post);
registerIcon('dot', DotIcon);
registerIcon('drag', DragIcon);
registerIcon('edit', EditIcon);
registerIcon('desk-empty', DeskEmptyIcon);
registerIcon('invisible', Invisible);
registerIcon('plus-fine', PlusFineIcon);
registerIcon('steps-finsh', StepsFinsh);
registerIcon('date', DateIcon);
registerIcon('remove', RemoveIcon);
registerIcon('invisible', InvisibleIcon);
registerIcon('down', DownIcon);
registerIcon('right-double-arrow', RightDoubleArrowIcon);
registerIcon('arrow-double-left', ArrowDoubleLeftIcon);
registerIcon('arrow-double-right', ArrowDoubleRightIcon);
registerIcon('new-edit', NewEdit);
registerIcon('rotate-left', RotateLeft);
registerIcon('rotate-right', RotateRight);
registerIcon('scale-origin', ScaleOrigin);
registerIcon('if', If);
registerIcon('rotate-screen', RotateScreen);

export interface IconCheckedSchema {
  id: string;
  name?: string;
  svg?: string;
}

export interface IconCheckedSchemaNew {
  type: 'icon';
  icon: IconCheckedSchema;
}

function svgString2Dom(
  icon: string,
  {
    className,
    classNameProp,
    style,
    cx,
    events,
    extra
  }: {
    [propName: string]: any;
  },
  vendorFn?: CustomVendorFn
) {
  icon = icon.replace(/\n/g, ' ').replace(/\s+/g, ' ');
  if (vendorFn) {
    const {icon: newIcon, style: newStyle} = vendorFn(icon, {
      ...extra,
      width: style?.width,
      height: style?.height
    });
    icon = newIcon;
    style = {
      ...(style || {}),
      ...newStyle
    };
  }
  const svgStr = /<svg .*?>(.*?)<\/svg>/.exec(icon);
  const viewBox = /viewBox="(.*?)"/.exec(icon);
  const svgHTML = createElement('svg', {
    ...events,
    className: cx('icon', className, classNameProp),
    style,
    dangerouslySetInnerHTML: {__html: svgStr ? svgStr[1] : ''},
    viewBox: viewBox?.[1] || '0 0 16 16'
  });
  return svgHTML;
}

function LinkIcon({
  icon,
  vendorFn,
  options: {className, classNameProp, style, cx, classPrefix, events, extra}
}: {
  icon: string;
  vendorFn?: CustomVendorFn;
  options: {
    [propName: string]: any;
  };
}) {
  const [svgIcon, setSvgIcon] = React.useState<string>(icon);
  const [svgType, setSvgType] = React.useState<string>('img');

  useEffect(() => {
    if (icon.endsWith('.svg') && vendorFn) {
      try {
        fetch(icon)
          .then(res => res.text())
          .then(svg => {
            setSvgType('svg');
            setSvgIcon(svg);
          })
          .catch(e => {
            console.warn(e);
            setSvgType('img');
            setSvgIcon(icon);
          });
      } catch (warn) {
        console.warn(warn);
        setSvgType('img');
        setSvgIcon(icon);
      }
    }
  }, [icon, vendorFn]);

  return svgType === 'img' ? (
    <img
      {...events}
      className={cx(`${classPrefix}Icon`, className, classNameProp)}
      src={icon}
      style={style}
    />
  ) : (
    svgString2Dom(
      svgIcon,
      {
        className,
        classNameProp,
        style,
        cx,
        events,
        extra
      },
      vendorFn
    )
  );
}

export function Icon({
  icon,
  className,
  classPrefix = '',
  classNameProp,
  iconContent,
  vendor,
  cx: iconCx,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseOver,
  onMouseOut,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  onBlur,
  onFocus,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  style,
  width,
  height,
  extra,
  testIdBuilder
}: {
  icon: string;
  iconContent?: string;
  testIdBuilder?: TestIdBuilder;
} & React.ComponentProps<any>) {
  let cx = iconCx || cxClass;
  const vendorFn = useMemo(() => getCustomVendor(vendor), [vendor]);

  // style = {
  //   ...(style || {}),
  //   width: width || style?.width,
  //   height: height || style?.height
  // };

  if (width !== undefined) {
    style = {
      ...style,
      width
    };
  }
  if (height !== undefined) {
    style = {
      ...style,
      height
    };
  }

  if (typeof jest !== 'undefined' && icon) {
    iconContent = '';
  }

  if (!icon && !iconContent) {
    return null;
  }

  // 支持的事件
  let events: any = {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onMouseOver,
    onMouseOut,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onBlur,
    onFocus,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel
  };

  // 直接的icon dom
  if (React.isValidElement(icon)) {
    return React.cloneElement(icon, {
      ...events,
      ...((icon.props as any) || {}),
      className: cxClass(
        cx(className, classNameProp),
        (icon.props as any).className
      ),
      style
    });
  }

  if (iconContent) {
    // 从css变量中获取icon
    const refFn = function (dom: any) {
      if (dom) {
        const domStyle = getComputedStyle(dom);
        const svgStr = domStyle.getPropertyValue('content');
        const svg = /(<svg.*<\/svg>)/.exec(svgStr);

        if (svg) {
          const svgHTML = svg[0].replace(/\\"/g, '"');
          if (dom.svgHTMLClone !== svgHTML) {
            dom.innerHTML = svgHTML;
            // 存储svg，不直接用innerHTML是防止<circle />渲染后变成<circle></circle>的情况
            dom.svgHTMLClone = svgHTML;
            dom.style.display = '';
          }
        }
      }
    };

    return (
      <div
        {...events}
        className={cx(iconContent, className, classNameProp)}
        ref={refFn}
        style={style}
        {...testIdBuilder?.getTestId()}
      ></div>
    );
  }

  // 获取注册的icon
  const Component = getIcon(icon);
  if (Component) {
    return (
      <Component
        {...events}
        className={cx(className, `icon-${icon}`, classNameProp)}
        // @ts-ignore
        icon={icon}
        style={style}
        {...testIdBuilder?.getTestId()}
      />
    );
  }

  // 符合schema的icon
  if (
    isObject(icon) &&
    (icon as IconCheckedSchemaNew).type === 'icon' &&
    (icon as IconCheckedSchemaNew).icon
  ) {
    icon = (icon as IconCheckedSchemaNew).icon;
  }

  // icon是引用svg的情况
  if (
    isObject(icon) &&
    typeof (icon as IconCheckedSchema).id === 'string' &&
    (icon as IconCheckedSchema).id.startsWith('svg-')
  ) {
    const svg = icon as IconCheckedSchema;
    const id = `${svg.id.replace(/^svg-/, '')}`;
    if (!document.getElementById(id)) {
      // 如果svg symbol不存在，则尝试将svg字符串赋值给icon，走svg字符串的逻辑
      icon = svg.svg?.replace(/'/g, '');
    } else {
      return (
        <svg
          {...events}
          className={cx('icon', 'icon-object', className, classNameProp)}
          style={style}
        >
          <use xlinkHref={'#' + id}></use>
        </svg>
      );
    }
  }

  // 直接传入svg字符串
  if (typeof icon === 'string' && icon.startsWith('<svg')) {
    return svgString2Dom(
      icon,
      {
        className,
        classNameProp,
        style,
        cx,
        events,
        extra
      },
      vendorFn
    );
  }

  // icon是链接
  const isURLIcon = typeof icon === 'string' && icon?.indexOf('.') !== -1;
  if (isURLIcon) {
    return (
      <LinkIcon
        icon={icon}
        vendorFn={vendorFn}
        options={{
          className,
          classNameProp,
          style,
          cx,
          classPrefix,
          events,
          extra
        }}
      />
    );
  }

  // icon是普通字符串
  const isIconfont = typeof icon === 'string';

  let iconPrefix = '';
  if (vendor === 'iconfont') {
    iconPrefix = `iconfont icon-${icon}`;
  } else if (vendor === 'fa') {
    //默认是fontawesome v4，兼容之前配置
    iconPrefix = `${vendor} ${vendor}-${icon}`;
  } else {
    // 如果vendor为空，则不设置前缀,这样可以支持fontawesome v5、fontawesome v6或者其他框架
    iconPrefix = icon;
  }

  if (isIconfont) {
    return (
      <i
        {...events}
        className={cx(icon, className, classNameProp, iconPrefix)}
        style={style}
      />
    );
  }

  // 没有合适的图标
  return <span className="text-danger">没有 icon {icon}</span>;
}

export default Icon;

export {
  InputClearIcon,
  CloseIcon,
  UnDoIcon,
  ReDoIcon,
  EnterIcon,
  VolumeIcon,
  MuteIcon,
  PlayIcon,
  PauseIcon,
  ReloadIcon,
  LeftArrowIcon,
  RightArrowIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon,
  FunctionIcon,
  MenuIcon,
  UserRemove,
  Role,
  Department,
  Post,
  RightDoubleArrowIcon,
  DownArrowBoldIcon
};
