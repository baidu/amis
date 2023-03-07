import {mergeRunInP, WTag, Tag} from './OpenXML';
import {parseXML, buildXML} from './util/xml';

test('merge text', () => {
  const xmlData = parseXML(`
  <w:p w14:paraId="2687ACFD" w14:textId="0463E18B" w:rsidR="00BB6066" w:rsidRDefault="007A2EAB">
      <w:r>
        <w:t xml:space="preserve"> {{var</w:t>
      </w:r>
      <w:proofErr w:type="gramStart"/>
      <w:r>
        <w:t>}}</w:t>
      </w:r>
  </w:p>
  `);

  mergeRunInP(xmlData[WTag.p]);

  expect(xmlData[WTag.p][WTag.r][0][WTag.t][Tag.text]).toBe(' {{var}}');
});
