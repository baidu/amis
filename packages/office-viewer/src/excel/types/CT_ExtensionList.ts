import {Attributes} from '../../openxml/Attributes';
import {Ext, Ext_Attributes} from './Ext';

export type CT_ExtensionList = {
  ext?: Ext[];
};

export const CT_ExtensionList_Attributes: Attributes = {
  ext: {
    type: 'child',
    childAttributes: Ext_Attributes,
    childIsArray: true
  }
};
