/**
 * @file Range
 * @description
 * @author fex
 */

 import range from 'lodash/range';
 import keys from 'lodash/keys';
 import isString from 'lodash/isString';
 import difference from 'lodash/difference';
 import has from 'lodash/has';
 import React from 'react';
 import ReactDOM from 'react-dom';
 import { uncontrollable } from 'uncontrollable';

 import { RendererProps } from '../factory';
 import { themeable } from '../theme';
 import { autobind } from '../utils/helper';
 import { Icon } from '../../src';
 import {
   MultipleValue,
   Value,
   FormarValue,
   MarksType,
   Overwrite,
   RangeItemProps
 } from '../renderers/Form/InputRange';
 import { stripNumber } from '../utils/tpl-builtin';

 interface HandleItemExtends {
   value: number;
   type?: 'min' | 'max';
   onChange: (value: number, type: 'min' | 'max') => void;
 }

 interface HandleItemProps extends Overwrite<HandleItemExtends, RangeItemProps> { }

 interface HandleItemState {
   isDrag: boolean;
   labelActive: boolean;
 }

 interface CommonBoundingState {
   offsetLeft: number;
   value: Value;
   isDrag: boolean;
 }

 /**
   * 公共类
   */
 class CommonBounding extends React.Component<RangeItemProps, CommonBoundingState> {
   // x坐标
   public positionX: number = 0;
   // y坐标
   public positionY: number = 0;
   // 宽度
   public width: number = 0;
   // 高度
   public height: number = 0;

   constructor(props: RangeItemProps) {
     super(props);

     this.state = {
       offsetLeft: 0, // 相对父元素left偏移量
       value: props.value,
       isDrag: false // 是否在拖拽中
     };
   }

   componentDidMount() {
     this.setBoundingClient();
   }

   /**
     * 获取 坐标、宽高
     */
   @autobind
   setBoundingClient() {
     const dom: Element | null | Text = ReactDOM.findDOMNode(this);
     const { x, y, width, height } = (dom as Element)?.getBoundingClientRect();
     this.positionX = x;
     this.positionY = y;
     this.width = width;
     this.height = height;
   }

   /**
     * 滑块改变事件
     * @param pageX target.pageX 坐标
     * @param type min max
     * @returns void
     */
   @autobind
   onChange(pageX: number, type: string = 'min') {
     const { max, min, step, multiple, value: originValue } = this.props;
     const value = this.pageXToValue(pageX);
     if (value > max || value < min) {
       return;
     }
     const result = stripNumber(this.getStepValue(value, step));
     if (multiple) {
       this.props.updateValue({...(originValue as MultipleValue), [type]: result });
     } else {
       this.props.updateValue(result);
     }
   }

   /**
     * 获取step为单位的value
     * @param value 拖拽后计算的value
     * @param step 步长
     * @returns step为单位的value
     */
   getStepValue(value: number, step: number) {
     const surplus = value % step;
     let result = 0;
     // 余数 >= 步长一半 -> 向上取
     // 余数 <  步长一半 -> 向下取
     const _value = surplus >= step / 2 ? value : value - step;
     while (result <= _value) {
       result += step;
     }
     return result;
   }

   /**
     * 坐标 -> 滑块值
     * @param pageX target.target 坐标
     * @returns 滑块值
     */
   pageXToValue(pageX: number) {
     const { positionX, width } = this;
     const { max, min } = this.props;
     return ((pageX - positionX) * (max - min)) / width;
   }

   /**
   * 滑块值 -> position.left
   * @param value 滑块值
   * @returns position.left
   */
   valueToOffsetLeft(value: any) {
     const { max, min } = this.props;
     return (value * 100) / (max - min) + '%';
   }
 }

 /**
   * 滑块handle
   * 双滑块涉及两个handle，单独抽一个组件
   */
 class HandleItem extends React.Component<HandleItemProps, HandleItemState> {
   constructor(props: HandleItemProps) {
     super(props);

     this.state = {
       isDrag: false,
       labelActive: false
     };
   }

   /**
     * mouseDown事件
     * 防止拖动过快，全局监听 mousemove、mouseup
     */
   @autobind
   onMouseDown() {
     this.setState({
       isDrag: true,
       labelActive: true
     });
     window.addEventListener('mousemove', this.onMouseMove);
     window.addEventListener('mouseup', this.onMouseUp);
   }

   /**
     * mouseMove事件
     * 触发公共onchange事件
     */
   @autobind
   onMouseMove(e: MouseEvent) {
     const { isDrag } = this.state;
     const { type = 'min' } = this.props;
     if (!isDrag) {
       return;
     }
     this.props.onChange(e.pageX, type);
   }

   /**
     * mouseUp事件
     * 移除全局 mousemove、mouseup
     */
   @autobind
   onMouseUp() {
     this.setState({
       isDrag: false,
       labelActive: false
     });
     this.props.onAfterChange();
     window.removeEventListener('mousemove', this.onMouseMove);
     window.removeEventListener('mouseup', this.onMouseUp);
   }

   /**
     * mouseEnter事件
     * 鼠标移入 -> 展示label
     */
   @autobind
   onMouseEnter() {
     this.setState({
       labelActive: true
     });
   }

   /**
     * mouseLeave事件
     * 鼠标移出 & !isDrag -> 隐藏label
     */
   @autobind
   onMouseLeave() {
     const { isDrag } = this.state;
     if (isDrag) {
       return;
     }
     this.setState({
       labelActive: false
     });
   }

   render() {
     const { classNames, disabled, value } = this.props;
     const { isDrag, labelActive } = this.state;
     const style = {
       left: this.props.valueToOffsetLeft(value),
       zIndex: isDrag ? 2 : 1
     };
     const props = {
       ...this.props,
       value,
       show: labelActive
     };
     return disabled ? (
       <>
         <div style={style} className={classNames.handle}>
           <Icon icon="slider-handle" className="icon" />
         </div>
         <Label {...props}></Label>
       </>
     ) : (
       <>
         <div
           style={style}
           className={isDrag ? classNames.handleDrage : classNames.handle}
           onMouseDown={this.onMouseDown}
           onMouseEnter={this.onMouseEnter}
           onMouseLeave={this.onMouseLeave}
         ><Icon icon="slider-handle" className="icon" /></div>
         <Label {...props}></Label>
       </>
     );
   }
 }

 /**
   * handle
   * 区分 单滑块 双滑块
   */
 class Handle extends CommonBounding {
   public multipleValue: MultipleValue = {
     min: (this.props.value as MultipleValue).min,
     max: (this.props.value as MultipleValue).max
   };

   /**
     * 双滑块改变最大值、最小值
     * @param pageX 拖拽后的pageX
     * @param type 'min' | 'max'
     */
   @autobind
   onGetChangeValue(pageX: number, type: keyof MultipleValue) {
     const {max, min} = this.props;
     const value = this.pageXToValue(pageX);
     if (value > max || value < min) {
       return;
     }
     this.multipleValue[type] = stripNumber(this.getStepValue(value, this.props.step));
     const _min = Math.min(this.multipleValue.min, this.multipleValue.max);
     const _max = Math.max(this.multipleValue.min, this.multipleValue.max);
     this.props.updateValue({ max: _max, min: _min });
   }

   render() {
     const { multiple, value } = this.props;

     const props = {
       ...this.props,
       valueToOffsetLeft: (value: number) => this.valueToOffsetLeft(value)
     };
     // 外部更新最大值、最小值，重设内部value
     const diff = difference(
       Object.values(value as MultipleValue),
       Object.values(this.multipleValue)
     );
     if (diff && !!diff.length) {
       this.multipleValue = {
         min: (value as MultipleValue).min,
         max: (value as MultipleValue).max
       };
     }
     return multiple
       ? (<div>
         {
           <HandleItem
             {...props}
             onChange={this.onGetChangeValue.bind(this)}
             value={this.multipleValue.min}
             type="min"
           />
         }
         {
           <HandleItem
             {...props}
             onChange={this.onGetChangeValue.bind(this)}
             value={this.multipleValue.max}
             type="max"
           />
         }
       </div>)
       : (<div>
         <HandleItem {...props} onChange={this.onChange.bind(this)} value={+value} />
       </div>);
   }
 }

 /**
   * 滑轨
   * 底层bg + 滑块值bg
   */
 class Track extends CommonBounding {
   /**
     * 点击滑轨 -> 触发公共onchange 改变value
     * @param e event
     * @returns void
     */
   @autobind
   onClick(e: any) {
     if (!!this.props.disabled) {
       return;
     }
     const { value } = this.props;
     const _value = this.pageXToValue(e.pageX);
     const type =
       Math.abs(_value - (value as MultipleValue).min) > Math.abs(_value - (value as MultipleValue).max)
         ? 'max'
         : 'min';
     this.onChange(e.pageX, type);
   }

   /**
     * 设置步长
     * @returns ReactNode
     */
   @autobind
   setStep() {
     const { max, min, step, showSteps, classNames } = this.props;
     const steps = Math.floor((max - min) / step);
     return showSteps && (
       <div>
         {range(steps - 1).map(item => (
           <span
             key={item}
             className={classNames.trackDot}
             style={{ left: ((item + 1) * 100) / steps + '%' }}
           ></span>
         ))}
       </div>
     );
   }

   render() {
     const { classNames, multiple, value } = this.props;
     const style = {
       width: this.valueToOffsetLeft(multiple ? (value as MultipleValue).max - (value as MultipleValue).min : value),
       left: this.valueToOffsetLeft(multiple ? (value as MultipleValue).min : 0)
     };
     return (
       <div className={classNames.track} onClick={this.onClick}>
         <div className={classNames.trackActive} style={style}></div>
         {this.setStep()}
         {this.props.children}
       </div>
     );
   }
 }

 /**
   * 滑块标签
   */
 class Label extends CommonBounding {
   render() {
     const {
       classnames: cx,
       classNames,
       value,
       show,
       tooltipVisible,
       tipFormatter,
       unit
     } = this.props;
     let { tooltipPlacement = 'top' } = this.props;
     // tooltipVisible 优先级 比show高
     // tooltipVisible 为 true时，tipFormatter才生效
     const isShow = tooltipVisible !== undefined
       ? (tooltipVisible && tipFormatter) ? tipFormatter(value) : tooltipVisible
       : show;
     const style: any = {
       visibility: isShow ? 'visible' : 'hidden',
       left: this.valueToOffsetLeft(value)
     };
     const labelClassMap = {
       auto: 'pos-top',
       top: 'pos-top',
       bottom: 'pos-bottom',
       left: 'pos-left',
       right: 'pos-right'
     };
     !has(labelClassMap, tooltipPlacement) && (tooltipPlacement = 'top');
     return (
       <div style={{ width: '100%' }}>
         <div className={cx(classNames.label, labelClassMap[tooltipPlacement])} style={style}>
           <span className={classNames.labelValue}>{value + unit}</span>
         </div>
       </div>
     );
   }
 }

 /**
   * 刻度
   */
 class Marks extends CommonBounding {
   /**
     * 计算每个标记 position.left
     * @param value 滑块值
     * @returns
     */
   @autobind
   getOffsetLeft(value: number | string) {
     const { max, min } = this.props;
     if (isString(value) && ~value.indexOf('%')) {
       return value;
     }
     return (+value * 100) / (max - min) + '%';
   }

   render() {
     const { classNames, marks } = this.props;
     const markIsObject = typeof marks === 'object' && !React.isValidElement(marks);
     return (
       marks && <div className={classNames.marks}>
         {keys(marks).map((key: keyof MarksType) => (
           <div key={key} style={{ left: this.getOffsetLeft(key) }}>
             <span style={markIsObject && (marks[key] as any)?.style}>
               {markIsObject ?  (marks[key] as any)?.label : marks[key]}
             </span>
           </div>
         ))}
       </div>
     );
   }
 }
 export class Range extends React.Component<RangeItemProps, any> {

   /**
     * 接收组件value变换
     * value变换 -> 公共onchange -> Range.updateValue
     * @param value
     */
   @autobind
   updateValue(value: FormarValue) {
     this.props.updateValue(value);
   }

   render() {
     const props: RangeItemProps = {
       ...this.props,
       classNames: {},
       updateValue: this.updateValue
     };

     const { classPrefix: ns, marks } = props;

     const classNames = {
       inputRangeWrap: `${ns}InputRange-wrap`,
       handle: `${ns}InputRange-handle`,
       handleDrage: `${ns}InputRange-handle ${ns}InputRange-handle-drage`,
       track: `${ns}InputRange-track ${ns}InputRange-track--background`,
       trackActive: `${ns}InputRange-track-active`,
       label: `${ns}InputRange-label`,
       trackDot: `${ns}InputRange-track-dot`,
       marks: `${ns}InputRange-marks`
     };
     props.classNames = classNames;

     return (
       <div className={classNames.inputRangeWrap}>
         <Track {...props}>
           <Handle {...props}></Handle>
           {marks && <Marks {...props}></Marks>}
         </Track>
       </div>
     );
   }
 }

 export default themeable(
   uncontrollable(Range, {
     value: 'onChange'
   })
 );
