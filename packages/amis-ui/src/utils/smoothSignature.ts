// 参考代码来源：https://github.com/linjc/smooth-signature/blob/master/src/index.ts
// 主要修改点： 新增loadFromBase64, 用于canvas回显。
interface IOptions {
  width?: number;
  height?: number;
  color?: string;
  bgColor?: string;
  scale?: number;
  openSmooth?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minSpeed?: number;
  maxWidthDiffRate?: number;
  maxHistoryLength?: number;
  onStart?: (event: any) => void;
  onEnd?: (event: any) => void;
}

interface IPoint {
  x: number;
  y: number;
  t: number;
  speed?: number;
  distance?: number;
  lineWidth?: number;
}

interface IRadianData {
  val: number;
  pos: -1 | 1;
}

const isMobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

class SmoothSignature {
  constructor(canvas: HTMLCanvasElement, options: IOptions) {
    this.init(canvas, options);
  }
  canvas: HTMLCanvasElement = {} as any;
  ctx: CanvasRenderingContext2D = {} as any;
  width = 320;
  height = 200;
  scale = window.devicePixelRatio || 1;
  color = 'black';
  bgColor = '';
  canDraw = false;
  openSmooth = true;
  minWidth = 2;
  maxWidth = 6;
  minSpeed = 1.5;
  maxWidthDiffRate = 20;
  points: IPoint[] = [];
  canAddHistory = true;
  historyList: string[] = [];
  maxHistoryLength = 20;
  onStart: any = () => {};
  onEnd: any = () => {};

  init(canvas: HTMLCanvasElement, options: IOptions = {}) {
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.width = options.width || canvas.clientWidth || this.width;
    this.height = options.height || canvas.clientHeight || this.height;
    this.scale = options.scale || this.scale;
    this.color = options.color || this.color;
    this.bgColor = options.bgColor || this.bgColor;
    this.openSmooth =
      options.openSmooth === undefined ? this.openSmooth : !!options.openSmooth;
    this.minWidth = options.minWidth || this.minWidth;
    this.maxWidth = options.maxWidth || this.maxWidth;
    this.minSpeed = options.minSpeed || this.minSpeed;
    this.maxWidthDiffRate = options.maxWidthDiffRate || this.maxWidthDiffRate;
    this.maxHistoryLength = options.maxHistoryLength || this.maxHistoryLength;
    this.onStart = options.onStart;
    this.onEnd = options.onEnd;
    if (this.scale > 0) {
      this.canvas.height = this.height * this.scale;
      this.canvas.width = this.width * this.scale;
      if (this.scale !== 1) {
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.scale(this.scale, this.scale);
      }
    }
    this.ctx.lineCap = 'round';
    this.drawBgColor();
    this.addListener();
  }

  addListener = () => {
    this.removeListener();
    this.canvas.style.touchAction = 'none';
    if (isMobile && ('ontouchstart' in window || navigator.maxTouchPoints)) {
      this.canvas.addEventListener('touchstart', this.onDrawStart, {
        passive: false
      });
      this.canvas.addEventListener('touchmove', this.onDrawMove, {
        passive: false
      });
      document.addEventListener('touchcancel', this.onDrawEnd, {
        passive: false
      });
      document.addEventListener('touchend', this.onDrawEnd, {passive: false});
    } else {
      this.canvas.addEventListener('mousedown', this.onDrawStart);
      this.canvas.addEventListener('mousemove', this.onDrawMove);
      document.addEventListener('mouseup', this.onDrawEnd);
    }
  };

  removeListener = () => {
    this.canvas.style.touchAction = 'auto';
    this.canvas.removeEventListener('touchstart', this.onDrawStart);
    this.canvas.removeEventListener('touchmove', this.onDrawMove);
    document.removeEventListener('touchend', this.onDrawEnd);
    document.removeEventListener('touchcancel', this.onDrawEnd);
    this.canvas.removeEventListener('mousedown', this.onDrawStart);
    this.canvas.removeEventListener('mousemove', this.onDrawMove);
    document.removeEventListener('mouseup', this.onDrawEnd);
  };

  onDrawStart = (e: any) => {
    e.preventDefault();
    this.canDraw = true;
    this.canAddHistory = true;
    this.ctx.strokeStyle = this.color;
    this.initPoint(e);
    this.onStart && this.onStart(e);
  };

  onDrawMove = (e: any) => {
    e.preventDefault();
    if (!this.canDraw) return;
    this.initPoint(e);
    if (this.points.length < 2) return;
    this.addHistory();
    const point = this.points.slice(-1)[0];
    const prePoint = this.points.slice(-2, -1)[0];
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(() => this.onDraw(prePoint, point));
    } else {
      this.onDraw(prePoint, point);
    }
  };

  onDraw = (prePoint: any, point: any) => {
    if (this.openSmooth) {
      this.drawSmoothLine(prePoint, point);
    } else {
      this.drawNoSmoothLine(prePoint, point);
    }
  };

  onDrawEnd = (e: any) => {
    if (!this.canDraw) return;
    this.canDraw = false;
    this.canAddHistory = true;
    this.points = [];
    this.onEnd && this.onEnd(e);
  };

  getLineWidth = (speed: number) => {
    const minSpeed =
      this.minSpeed > 10 ? 10 : this.minSpeed < 1 ? 1 : this.minSpeed;
    const addWidth = ((this.maxWidth - this.minWidth) * speed) / minSpeed;
    const lineWidth = Math.max(this.maxWidth - addWidth, this.minWidth);
    return Math.min(lineWidth, this.maxWidth);
  };

  getRadianData = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): IRadianData => {
    const dis_x = x2 - x1;
    const dis_y = y2 - y1;
    if (dis_x === 0) {
      return {val: 0, pos: -1};
    }
    if (dis_y === 0) {
      return {val: 0, pos: 1};
    }
    const val = Math.abs(Math.atan(dis_y / dis_x));
    if ((x2 > x1 && y2 < y1) || (x2 < x1 && y2 > y1)) {
      return {val, pos: 1};
    }
    return {val, pos: -1};
  };

  getRadianPoints = (
    radianData: IRadianData,
    x: number,
    y: number,
    halfLineWidth: number
  ) => {
    if (radianData.val === 0) {
      if (radianData.pos === 1) {
        return [
          {x, y: y + halfLineWidth},
          {x, y: y - halfLineWidth}
        ];
      }
      return [
        {y, x: x + halfLineWidth},
        {y, x: x - halfLineWidth}
      ];
    }
    const dis_x = Math.sin(radianData.val) * halfLineWidth;
    const dis_y = Math.cos(radianData.val) * halfLineWidth;
    if (radianData.pos === 1) {
      return [
        {x: x + dis_x, y: y + dis_y},
        {x: x - dis_x, y: y - dis_y}
      ];
    }
    return [
      {x: x + dis_x, y: y - dis_y},
      {x: x - dis_x, y: y + dis_y}
    ];
  };

  initPoint = (event: any) => {
    const t = Date.now();
    const prePoint = this.points.slice(-1)[0];
    if (prePoint && prePoint.t === t) {
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    const e = (event.touches && event.touches[0]) || event;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (prePoint && prePoint.x === x && prePoint.y === y) {
      return;
    }
    const point: IPoint = {x, y, t};
    if (this.openSmooth && prePoint) {
      const prePoint2 = this.points.slice(-2, -1)[0];
      point.distance = Math.sqrt(
        Math.pow(point.x - prePoint.x, 2) + Math.pow(point.y - prePoint.y, 2)
      );
      point.speed = point.distance / (point.t - prePoint.t || 0.1);
      point.lineWidth = this.getLineWidth(point.speed);
      if (prePoint2 && prePoint2.lineWidth && prePoint.lineWidth) {
        const rate =
          (point.lineWidth - prePoint.lineWidth) / prePoint.lineWidth;
        let maxRate = this.maxWidthDiffRate / 100;
        maxRate = maxRate > 1 ? 1 : maxRate < 0.01 ? 0.01 : maxRate;
        if (Math.abs(rate) > maxRate) {
          const per = rate > 0 ? maxRate : -maxRate;
          point.lineWidth = prePoint.lineWidth * (1 + per);
        }
      }
    }
    this.points.push(point);
    this.points = this.points.slice(-3);
  };

  drawSmoothLine = (prePoint: any, point: any) => {
    const dis_x = point.x - prePoint.x;
    const dis_y = point.y - prePoint.y;
    if (Math.abs(dis_x) + Math.abs(dis_y) <= this.scale) {
      point.lastX1 = point.lastX2 = prePoint.x + dis_x * 0.5;
      point.lastY1 = point.lastY2 = prePoint.y + dis_y * 0.5;
    } else {
      point.lastX1 = prePoint.x + dis_x * 0.3;
      point.lastY1 = prePoint.y + dis_y * 0.3;
      point.lastX2 = prePoint.x + dis_x * 0.7;
      point.lastY2 = prePoint.y + dis_y * 0.7;
    }
    point.perLineWidth = (prePoint.lineWidth + point.lineWidth) / 2;
    if (typeof prePoint.lastX1 === 'number') {
      this.drawCurveLine(
        prePoint.lastX2,
        prePoint.lastY2,
        prePoint.x,
        prePoint.y,
        point.lastX1,
        point.lastY1,
        point.perLineWidth
      );
      if (prePoint.isFirstPoint) return;
      if (
        prePoint.lastX1 === prePoint.lastX2 &&
        prePoint.lastY1 === prePoint.lastY2
      )
        return;
      const data = this.getRadianData(
        prePoint.lastX1,
        prePoint.lastY1,
        prePoint.lastX2,
        prePoint.lastY2
      );
      const points1 = this.getRadianPoints(
        data,
        prePoint.lastX1,
        prePoint.lastY1,
        prePoint.perLineWidth / 2
      );
      const points2 = this.getRadianPoints(
        data,
        prePoint.lastX2,
        prePoint.lastY2,
        point.perLineWidth / 2
      );
      this.drawTrapezoid(points1[0], points2[0], points2[1], points1[1]);
    } else {
      point.isFirstPoint = true;
    }
  };

  drawNoSmoothLine = (prePoint: any, point: any) => {
    point.lastX = prePoint.x + (point.x - prePoint.x) * 0.5;
    point.lastY = prePoint.y + (point.y - prePoint.y) * 0.5;
    if (typeof prePoint.lastX === 'number') {
      this.drawCurveLine(
        prePoint.lastX,
        prePoint.lastY,
        prePoint.x,
        prePoint.y,
        point.lastX,
        point.lastY,
        this.maxWidth
      );
    }
  };

  drawCurveLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    lineWidth: number
  ) => {
    this.ctx.lineWidth = Number(lineWidth.toFixed(1));
    this.ctx.beginPath();
    this.ctx.moveTo(Number(x1.toFixed(1)), Number(y1.toFixed(1)));
    this.ctx.quadraticCurveTo(
      Number(x2.toFixed(1)),
      Number(y2.toFixed(1)),
      Number(x3.toFixed(1)),
      Number(y3.toFixed(1))
    );
    this.ctx.stroke();
  };

  drawTrapezoid = (point1: any, point2: any, point3: any, point4: any) => {
    this.ctx.beginPath();
    this.ctx.moveTo(Number(point1.x.toFixed(1)), Number(point1.y.toFixed(1)));
    this.ctx.lineTo(Number(point2.x.toFixed(1)), Number(point2.y.toFixed(1)));
    this.ctx.lineTo(Number(point3.x.toFixed(1)), Number(point3.y.toFixed(1)));
    this.ctx.lineTo(Number(point4.x.toFixed(1)), Number(point4.y.toFixed(1)));
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  };

  drawBgColor = () => {
    if (!this.bgColor) return;
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  };

  drawByImageUrl = (url: string) => {
    const image = new Image();
    image.onload = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(image, 0, 0, this.width, this.height);
    };
    image.crossOrigin = 'anonymous';
    image.src = url;
  };

  addHistory = () => {
    if (!this.maxHistoryLength || !this.canAddHistory) return;
    this.canAddHistory = false;
    this.historyList.push(this.canvas.toDataURL());
    this.historyList = this.historyList.slice(-this.maxHistoryLength);
  };

  clear = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBgColor();
    this.historyList.length = 0;
  };

  undo = () => {
    const dataUrl = this.historyList.splice(-1)[0];
    dataUrl && this.drawByImageUrl(dataUrl);
  };

  toDataURL = (type = 'image/png', quality = 1) => {
    if (this.canvas.width === this.width) {
      return this.canvas.toDataURL(type, quality);
    }
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(this.canvas, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL(type, quality);
  };

  getPNG = () => {
    return this.toDataURL();
  };

  getJPG = (quality = 0.8) => {
    return this.toDataURL('image/jpeg', quality);
  };

  isEmpty = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    if (this.bgColor) {
      ctx.fillStyle = this.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (this.scale !== 1) {
      ctx.scale(this.scale, this.scale);
    }
    return canvas.toDataURL() === this.canvas.toDataURL();
  };

  getRotateCanvas = (degree = 90) => {
    if (degree > 0) {
      degree = degree > 90 ? 180 : 90;
    } else {
      degree = degree < -90 ? 180 : -90;
    }
    const canvas = document.createElement('canvas');
    const w = this.width;
    const h = this.height;
    if (degree === 180) {
      canvas.width = w;
      canvas.height = h;
    } else {
      canvas.width = h;
      canvas.height = w;
    }
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.rotate((degree * Math.PI) / 180);
    if (degree === 90) {
      // 顺时针90度
      ctx.drawImage(this.canvas, 0, -h, w, h);
    } else if (degree === -90) {
      // 逆时针90度
      ctx.drawImage(this.canvas, -w, 0, w, h);
    } else if (degree === 180) {
      ctx.drawImage(this.canvas, -w, -h, w, h);
    }
    return canvas;
  };

  /**
   * drawImage base64
   * @date 2024-12-02 星期一
   * @function
   * @param {}
   * @return {}
   */
  loadFromBase64(base64: string) {
    const image = new Image();
    image.onload = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(image, 0, 0, this.width, this.height);
    };
    image.src = base64;
  }
}

export default SmoothSignature;
