import React, {useEffect} from 'react';
import {Modal, Button} from 'amis';
import cx from 'classnames';
import FormulaEditor from 'amis-ui/lib/components/formula/Editor';

export interface FormulaPickerProps {
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
}

export interface CustomFormulaPickerProps extends FormulaPickerProps {
  [propName: string]: any;
}

const FormulaPicker: React.FC<FormulaPickerProps> = props => {
  const {variables, variableMode, evalMode = true} = props;
  const [formula, setFormula] = React.useState<string | undefined>(undefined);
  useEffect(() => {
    const {initable, value} = props;
    if (initable) {
      setFormula(value);
    }
  }, [props.value]);

  const handleChange = (data: any) => {
    setFormula(data);
  };

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const handleConfirm = () => {
    props.onConfirm && props.onConfirm(formula);
  };

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
          header={props.header || '表达式'}
          variables={variables}
          variableMode={variableMode}
          value={formula}
          evalMode={evalMode}
          onChange={handleChange}
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
