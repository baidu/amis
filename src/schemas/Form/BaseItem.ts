export interface FormBaseControl {
  size?: 'xs' | 'sm' | 'md' | 'lg';

  label?: string;

  name?: string;

  // todo
  remark?: string;

  // todo
  labelRemark?: string;

  /**
   * 输入提示，聚焦的时候显示
   */
  hint?: string;

  /**
   * 当修改完的时候是否提交表单。
   */
  submitOnChange?: boolean;

  readOnly?: boolean;

  disabled?: boolean;
}
