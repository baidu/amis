import {registerCustomVendor} from 'amis-core';

function guid() {
  return (
    'mk-' +
    'xxxxxxxx'.replace(/x/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = (r & 0x3) | 0x8;
      return v.toString(16);
    })
  );
}

function setBorderStyle(
  d: SVGPathElement | SVGRectElement,
  style: {
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
  }
) {
  style.borderWidth !== undefined &&
    d.setAttribute('stroke-width', `${style.borderWidth}`);
  style.borderColor !== undefined &&
    d.setAttribute('stroke', style.borderColor);
  style.borderRadius !== undefined &&
    d.setAttribute('rx', `${style.borderRadius}`);
  if (style.borderRadius) {
    d.setAttribute('stroke-linecap', 'round');
  }
}

export function mk(
  icon: string,
  {
    colorScheme,
    borderRadius,
    borderWidth,
    borderColor,
    supportBorderRadius,
    width,
    height,
    shadow
  }: {
    colorScheme: any;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    supportBorderRadius: boolean;
    width: number;
    height: number;
    shadow?: {
      enable: boolean;
      color: string;
      blur: number;
      direction: number;
    };
  }
) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(icon, 'image/svg+xml');
  const svg = svgDoc.documentElement;
  const rect = svg.querySelectorAll('rect');
  const path = svg.querySelectorAll('path');
  const polygon = svg.querySelectorAll('polygon');
  const p = [...path, ...polygon, ...rect];
  if (supportBorderRadius !== false) {
    // 需要将width和height写到svg的viewBox属性里面和rect的width和height属性里面
    const viewBox = svg.getAttribute('viewBox') || '0 0';
    const [x, y] = viewBox.split(' ');
    svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
    rect.forEach(r => {
      r.setAttribute('width', `${width}`);
      r.setAttribute('height', `${height}`);
    });
  }
  p.forEach(d => {
    setBorderStyle(d, {
      borderWidth,
      borderColor,
      borderRadius
    });
  });

  const linearGradient = svg.querySelectorAll('linearGradient');
  const styleDom = svg.querySelector('style');
  const replaceMap = new Map();
  if (linearGradient.length) {
    linearGradient.forEach((lg: SVGLinearGradientElement) => {
      const id = lg.getAttribute('id');
      if (id) {
        replaceMap.set(id, guid());
      }
    });
  }
  if (styleDom) {
    const style = styleDom.textContent || '';
    // 解析出所有的className
    const classNames =
      style.match(/\.[a-zA-Z0-9_-]+/g)?.map(n => n.replace('.', '')) || [];
    classNames.forEach(className => {
      replaceMap.set(className, guid());
    });
  }

  let style: any = {
    overflow: 'visible'
  };
  if (shadow?.enable) {
    style.filter = `drop-shadow(${shadow.direction}px ${shadow.direction}px ${shadow.blur}px ${shadow.color})`;
  }
  let svgStr = svg.outerHTML;
  if (colorScheme) {
    Object.keys(colorScheme).forEach(key => {
      svgStr = svgStr.replace(new RegExp(key, 'g'), colorScheme[key]);
    });
  }

  replaceMap.forEach((newId, oldId) => {
    svgStr = svgStr.replace(new RegExp(oldId, 'g'), newId);
  });
  return {
    icon: svgStr,
    style
  };
}

registerCustomVendor('mk', mk);
