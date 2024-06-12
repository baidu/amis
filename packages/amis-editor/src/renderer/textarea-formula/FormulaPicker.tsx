import React, {useEffect} from 'react';
import {Modal, Button} from 'amis';
import {FormControlProps, resolveVariableAndFilter} from 'amis-core';
import cx from 'classnames';
import {FormulaEditor} from 'amis-ui';

export interface FormulaPickerProps extends FormControlProps {
  onConfirm: (data: string | undefined) => void;
  onClose: () => void;
  variables: any[];
  value?: string;
  initable?: boolean;
  variableMode?: 'tabs' | 'tree';
  evalMode?: boolean;
  /**
   * 弹窗顶部标题，默认为 "表达式"
   */
  header: string;
  simplifyMemberOprs?: boolean;
}

export interface CustomFormulaPickerProps extends FormulaPickerProps {
  [propName: string]: any;
}

const FormulaPicker: React.FC<FormulaPickerProps> = props => {
  const {variables, variableMode, evalMode = true} = props;
  const [formula, setFormula] = React.useState<string | undefined>(undefined);
  const [header, setHeader] = React.useState<string>(props.header);
  useEffect(() => {
    const {initable, value} = props;
    if (initable) {
      setFormula(value);
    }
  }, [props.value]);

  useEffect(() => {
    setHeader(resolveVariableAndFilter(props.header, props.data));
  }, [props.data]);

  const handleChange = (data: any) => {
    setFormula(data);
  };

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const handleConfirm = () => {
    props.onConfirm && props.onConfirm(formula);
  };

  // 自身字段
  const selfName = props?.data?.name;

  return (
    <Modal
      className={cx('FormulaPicker-Modal')}
      size="lg"
      show
      onHide={handleClose}
      closeOnEsc
    >
      <Modal.Body>
        <FormulaEditor
          {...props}
          header={header || '表达式'}
          variables={variables}
          variableMode={variableMode}
          value={formula}
          evalMode={evalMode}
          onChange={handleChange}
          selfVariableName={selfName}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleConfirm} level="primary">
          确认
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormulaPicker;
