import {Placeholder} from './Placeholder';
import './Form.tsx';
import {registerRenderer} from '../factory';

registerRenderer({
  type: 'spinner',
  component: Placeholder
});

registerRenderer({
  type: 'alert',
  component: Placeholder
});

registerRenderer({
  type: 'dialog',
  component: Placeholder
});

registerRenderer({
  type: 'drawer',
  component: Placeholder
});
