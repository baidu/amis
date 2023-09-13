const React = require('react');

exports['default'] = React.forwardRef((props, ref) =>
  React.createElement('icon-mock', {ref, ...props})
);
