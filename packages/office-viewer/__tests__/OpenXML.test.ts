import {createWord} from './EmptyWord';
import {WTag, Tag} from '../src/OpenXML';
import {mergeRunInP} from '../src/util/mergeRun';
import {parseXML, buildXML} from '../src/util/xml';

test('merge text', async () => {
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

  const word = await createWord();

  mergeRunInP(word, xmlData[WTag.p]);

  expect(xmlData[WTag.p][WTag.r][0][WTag.t][Tag.text]).toBe(' {{var}}');
});

test('merge text font hint', async () => {
  const xmlData = parseXML(`
  <w:p w14:paraId="2687ACFD" w14:textId="0463E18B" w:rsidR="00BB6066" w:rsidRDefault="007A2EAB">
    <w:r>
      <w:rPr>
        <w:rFonts w:hint="eastAsia"/>
      </w:rPr>
      <w:t>B</w:t>
    </w:r>
    <w:r>
      <w:t>6</w:t>
    </w:r>
  </w:p>
  `);

  const word = await createWord();

  mergeRunInP(word, xmlData[WTag.p]);

  expect(xmlData[WTag.p][WTag.r][0][WTag.t][Tag.text]).toBe('B6');
});

test('merge text space', async () => {
  const xmlData = parseXML(`
  <w:p w14:paraId="2687ACFD" w14:textId="0463E18B" w:rsidR="00BB6066" w:rsidRDefault="007A2EAB">
    <w:r>
      <w:t>C</w:t>
    </w:r>
    <w:r w:rsidR="007D7B36">
      <w:t>ustom</w:t>
    </w:r>
    <w:r>
      <w:t xml:space="preserve">  </w:t>
    </w:r>
    <w:r w:rsidR="007D7B36">
      <w:t>Style</w:t>
    </w:r>
  </w:p>
  `);

  const word = await createWord();

  mergeRunInP(word, xmlData[WTag.p]);

  expect(xmlData[WTag.p][WTag.r][0][WTag.t][Tag.text]).toBe('Custom  Style');
});
