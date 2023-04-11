/**
 * http://officeopenxml.com/WPshading.php
 */

import {ST_Shd} from '../Types';

export interface Shading {
  readonly fill?: string;
  readonly color?: string;
  readonly type?: ST_Shd;
}
