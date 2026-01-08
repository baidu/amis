import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import {HashRouter} from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/v4-shims.css';
import 'amis-ui/scss/themes/cxd.scss';
import 'amis-ui/scss/helper.scss';
// import 'amis/sdk/iconfont.css';
import 'amis-editor-core/scss/editor.scss';
import './style.scss';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
