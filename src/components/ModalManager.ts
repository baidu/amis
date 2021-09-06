/**
 * @file ModalManager
 * @description
 * @author fex
 */

import keycode from 'keycode';

interface ModalComponent
  extends React.Component<{
    onHide: (e: any) => void;
    disabled?: boolean;
    closeOnEsc?: boolean;
  }> {}

let modals: Array<ModalComponent> = [];

export function current() {
  return modals.length;
}

export function currentModal(): ModalComponent | void {
  return modals[modals.length - 1];
}

export function addModal(modal: ModalComponent) {
  modals.push(modal);
}

export function removeModal(modal: ModalComponent) {
  modals = modals.filter(el => el !== modal);
}

window.addEventListener('keydown', handleWindowKeyDown);

function handleWindowKeyDown(e: Event) {
  const code = keycode(e);
  if (code !== 'esc') {
    return;
  }
  let modal = currentModal();
  if (!modal) {
    return;
  }
  const {disabled, closeOnEsc} = modal.props;
  if (closeOnEsc && !disabled) {
    modal.props.onHide(e);
  }
}
