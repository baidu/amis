/**
 * @file entry of this example.
 * @author fex
 */
import * as React from 'react';
import {createRoot} from 'react-dom/client';
import App from './examples/App';

export function bootstrap(mountTo: HTMLElement, initalState: any) {
  const root = createRoot(mountTo);
  root.render(<App />);
}
