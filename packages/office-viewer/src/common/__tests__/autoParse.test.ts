import {CT_Marker_Attributes} from '../../openxml/ExcelTypes';
import {xml2json} from '../../util/xml';
import {autoParse} from '../autoParse';

test('from', async () => {
  const fromNode = await xml2json(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <xdr:from>
      <xdr:col>0</xdr:col>
      <xdr:colOff>0</xdr:colOff>
      <xdr:row>6</xdr:row>
      <xdr:rowOff>0</xdr:rowOff>
    </xdr:from>`
  );

  const from = autoParse(fromNode, CT_Marker_Attributes);

  expect(from).toEqual({
    col: [0],
    colOff: ['0'],
    row: [6],
    rowOff: ['0']
  });
});
