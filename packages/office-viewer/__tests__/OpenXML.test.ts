import {createWord} from './EmptyWord';
import {mergeRun} from '../src/util/mergeRun';
import {parseXML} from '../src/util/xml';

test('proofErr', async () => {
  const xmlDoc = parseXML(
    `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>{{var</w:t>
      </w:r>
      <w:proofErr w:type="gramStart"/>
      <w:r>
        <w:t>}}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>
  `.trim()
  );

  const word = createWord();

  mergeRun(word, xmlDoc);

  expect(xmlDoc.getElementsByTagName('w:t')[0]?.innerHTML).toBe('{{var}}');
});

test('font hint', async () => {
  const xmlDoc = parseXML(
    `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        <w:p>
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
      </w:body>
    </w:document>
      `.trim()
  );

  const word = createWord();
  mergeRun(word, xmlDoc);
  expect(xmlDoc.getElementsByTagName('w:t')[0]?.innerHTML).toBe('B6');
});

test('space', async () => {
  const xmlDoc = parseXML(
    `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        <w:p>
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
      </w:body>
    </w:document>
      `.trim()
  );

  const word = createWord();

  mergeRun(word, xmlDoc);

  expect(xmlDoc.getElementsByTagName('w:t')[0]?.innerHTML).toBe('Custom');
});
