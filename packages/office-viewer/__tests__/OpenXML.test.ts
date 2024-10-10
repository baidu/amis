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

test('multi_proofErr', async () => {
  const xmlDoc = parseXML(
    `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        <w:p w:rsidR="00EA74AA" w:rsidRDefault="001F5EBE" w:rsidP="003D533A">
          <w:pPr>
            <w:spacing w:line="560" w:lineRule="exact"/>
            <w:jc w:val="center"/>
            <w:rPr>
              <w:rFonts w:ascii="SimSun" w:eastAsia="SimSun" w:hAnsi="SimSun" w:cs="Times New Roman"/>
              <w:color w:val="FF0000"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
            </w:rPr>
          </w:pPr>
          <w:r w:rsidRPr="001F5EBE">
            <w:rPr>
              <w:rFonts w:ascii="SimSun" w:eastAsia="SimSun" w:hAnsi="SimSun" w:cs="Times New Roman"/>
              <w:color w:val="000000" w:themeColor="text1"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
            </w:rPr>
            <w:t>{{</w:t>
          </w:r>
          <w:proofErr w:type="spellStart"/>
          <w:r w:rsidRPr="001F5EBE">
            <w:rPr>
              <w:rFonts w:ascii="SimSun" w:eastAsia="SimSun" w:hAnsi="SimSun" w:cs="Times New Roman"/>
              <w:color w:val="000000" w:themeColor="text1"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
            </w:rPr>
            <w:t>operate_</w:t>
          </w:r>
          <w:proofErr w:type="gramStart"/>
          <w:r w:rsidRPr="001F5EBE">
            <w:rPr>
              <w:rFonts w:ascii="SimSun" w:eastAsia="SimSun" w:hAnsi="SimSun" w:cs="Times New Roman"/>
              <w:color w:val="000000" w:themeColor="text1"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
            </w:rPr>
            <w:t>applicant.label</w:t>
          </w:r>
          <w:proofErr w:type="spellEnd"/>
          <w:proofErr w:type="gramEnd"/>
          <w:r w:rsidRPr="001F5EBE">
            <w:rPr>
              <w:rFonts w:ascii="SimSun" w:eastAsia="SimSun" w:hAnsi="SimSun" w:cs="Times New Roman"/>
              <w:color w:val="000000" w:themeColor="text1"/>
              <w:sz w:val="18"/>
              <w:szCs w:val="18"/>
            </w:rPr>
            <w:t>}}</w:t>
          </w:r>
        </w:p>
      </w:body>
    </w:document>
      `.trim()
  );

  const word = createWord();

  mergeRun(word, xmlDoc);

  expect(xmlDoc.getElementsByTagName('w:t')[0]?.innerHTML).toBe(
    '{{operate_applicant.label}}'
  );
});

test('multi_run', async () => {
  const xmlDoc = parseXML(
    `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        <w:p w:rsidR="00EA74AA" w:rsidRDefault="0089111F" w:rsidP="003D533A">
        <w:pPr>
          <w:spacing w:line="560" w:lineRule="exact"/>
          <w:jc w:val="center"/>
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="FF0000"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
        </w:pPr>
        <w:r w:rsidRPr="003826F8">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman" w:hint="eastAsia"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>{</w:t>
        </w:r>
        <w:r w:rsidRPr="003826F8">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>{</w:t>
        </w:r>
        <w:r w:rsidR="00887A64" w:rsidRPr="00D1772D">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>operate</w:t>
        </w:r>
        <w:r w:rsidR="00636549">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>_</w:t>
        </w:r>
        <w:r w:rsidR="00636549">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman" w:hint="eastAsia"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>a</w:t>
        </w:r>
        <w:r w:rsidR="00887A64" w:rsidRPr="00D1772D">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>pplicate</w:t>
        </w:r>
        <w:r w:rsidR="00636549">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>_u</w:t>
        </w:r>
        <w:r w:rsidR="00887A64" w:rsidRPr="00D1772D">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>nit</w:t>
        </w:r>
        <w:r w:rsidR="00343289">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>.label</w:t>
        </w:r>
        <w:r w:rsidRPr="003826F8">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>}}</w:t>
        </w:r>
      </w:p>
      </w:body>
    </w:document>
      `.trim()
  );

  const word = createWord();

  mergeRun(word, xmlDoc);

  expect(xmlDoc.getElementsByTagName('w:t')[0]?.innerHTML).toBe(
    '{{operate_applicate_unit.label}}'
  );
});

test('error_proof', async () => {
  const xmlDoc = parseXML(
    `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        <w:p w:rsidR="00EA74AA" w:rsidRPr="00343289" w:rsidRDefault="00D06055" w:rsidP="00D06055">
        <w:pPr>
          <w:spacing w:line="560" w:lineRule="exact"/>
          <w:jc w:val="center"/>
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>{{</w:t>
        </w:r>
        <w:proofErr w:type="spellStart"/>
        <w:r w:rsidRPr="00D06055">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>operate_work_type</w:t>
        </w:r>
        <w:r w:rsidR="00942520">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>.</w:t>
        </w:r>
        <w:r w:rsidR="00942520">
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>label</w:t>
        </w:r>
        <w:proofErr w:type="spellEnd"/>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="宋体" w:eastAsia="宋体" w:hAnsi="宋体" w:cs="Times New Roman"/>
            <w:color w:val="000000" w:themeColor="text1"/>
            <w:sz w:val="18"/>
            <w:szCs w:val="18"/>
          </w:rPr>
          <w:t>}}</w:t>
        </w:r>
      </w:p>
      </w:body>
    </w:document>
      `.trim()
  );

  const word = createWord();

  mergeRun(word, xmlDoc);

  expect(xmlDoc.getElementsByTagName('w:t')[0]?.innerHTML).toBe(
    '{{operate_work_type.label}}'
  );
});
