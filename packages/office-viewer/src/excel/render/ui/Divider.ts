import {H} from '../../../util/H';

export class Divider {
  constructor(container: HTMLElement) {
    const divider = H('div', {
      className: 'excel-divider',
      parent: container
    });
  }
}
