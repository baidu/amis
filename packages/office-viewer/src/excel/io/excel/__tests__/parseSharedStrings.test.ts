import {parseSharedStrings} from '../parseSharedStrings';

test('sharedString', async () => {
  const result = await parseSharedStrings(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="10" uniqueCount="10">
      <si>
        <t>text</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <t>background</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <r>
          <rPr>
            <sz val="12"/>
            <color rgb="FFFF0000"/>
            <rFont val="等线"/>
            <family val="3"/>
            <charset val="134"/>
          </rPr>
          <t>rich</t>
        </r>
        <r>
          <rPr>
            <sz val="12"/>
            <color theme="1"/>
            <rFont val="等线"/>
            <family val="2"/>
            <charset val="134"/>
            <scheme val="minor"/>
          </rPr>
          <t>t</t>
        </r>
        <r>
          <rPr>
            <sz val="14"/>
            <color theme="1"/>
            <rFont val="等线"/>
            <family val="3"/>
            <charset val="134"/>
          </rPr>
          <t>e</t>
        </r>
        <r>
          <rPr>
            <sz val="12"/>
            <color theme="1"/>
            <rFont val="等线"/>
            <family val="2"/>
            <charset val="134"/>
            <scheme val="minor"/>
          </rPr>
          <t>x</t>
        </r>
        <r>
          <rPr>
            <sz val="14"/>
            <color theme="1"/>
            <rFont val="等线"/>
            <family val="3"/>
            <charset val="134"/>
          </rPr>
          <t>t</t>
        </r>
        <r>
          <rPr>
            <sz val="12"/>
            <color theme="1"/>
            <rFont val="等线"/>
            <family val="4"/>
            <charset val="134"/>
          </rPr>
          <t>d</t>
        </r>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <t>bold</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <t>italic</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <t>underline</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <t>bottom align</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <t>top align</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <t>align right</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <t>align center</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
    </sst>`
  );
  expect(result).toEqual([
    'text',
    'background',
    {
      richText: [
        {
          rPr: {
            sz: 12,
            color: {
              rgb: 'FFFF0000'
            },
            rFont: '等线',
            family: 3,
            charset: 134
          },
          t: 'rich'
        },
        {
          rPr: {
            sz: 12,
            color: {
              theme: 1
            },
            rFont: '等线',
            family: 2,
            charset: 134,
            scheme: 'minor'
          },
          t: 't'
        },
        {
          rPr: {
            sz: 14,
            color: {
              theme: 1
            },
            rFont: '等线',
            family: 3,
            charset: 134
          },
          t: 'e'
        },
        {
          rPr: {
            sz: 12,
            color: {
              theme: 1
            },
            rFont: '等线',
            family: 2,
            charset: 134,
            scheme: 'minor'
          },
          t: 'x'
        },
        {
          rPr: {
            sz: 14,
            color: {
              theme: 1
            },
            rFont: '等线',
            family: 3,
            charset: 134
          },
          t: 't'
        },
        {
          rPr: {
            sz: 12,
            color: {
              theme: 1
            },
            rFont: '等线',
            family: 4,
            charset: 134
          },
          t: 'd'
        }
      ],
      type: 'rich'
    },
    'bold',
    'italic',
    'underline',
    'bottom align',
    'top align',
    'align right',
    'align center'
  ]);
});
