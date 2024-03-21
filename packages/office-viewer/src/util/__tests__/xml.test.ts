import {xml2json} from '../xml';

test('rel', async () => {
  const rel = await xml2json(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
  );
  expect(rel).toEqual({
    tag: 'Relationships',
    attrs: {
      xmlns: 'http://schemas.openxmlformats.org/package/2006/relationships'
    },
    children: [
      {
        tag: 'Relationship',
        attrs: {
          Id: 'rId3',
          Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties',
          Target: 'docProps/app.xml'
        },
        children: []
      },
      {
        tag: 'Relationship',
        attrs: {
          Id: 'rId2',
          Type: 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties',
          Target: 'docProps/core.xml'
        },
        children: []
      },
      {
        tag: 'Relationship',
        attrs: {
          Id: 'rId1',
          Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument',
          Target: 'xl/workbook.xml'
        },
        children: []
      }
    ],
    text: '\n'
  });
});

test('sharedStrings', async () => {
  const sharedStrings = await xml2json(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="2" uniqueCount="2">
      <si>
        <t>a</t>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
      <si>
        <r>
          <t>b</t>
        </r>
        <r>
          <rPr>
            <sz val="12"/>
            <color rgb="FFFF0000"/>
            <rFont val="等线"/>
            <family val="3"/>
            <charset val="134"/>
          </rPr>
          <t>c</t>
        </r>
        <r>
          <rPr>
            <sz val="14"/>
            <color theme="1"/>
            <rFont val="等线"/>
            <family val="3"/>
            <charset val="134"/>
          </rPr>
          <t>d</t>
        </r>
        <phoneticPr fontId="1" type="noConversion"/>
      </si>
    </sst>`
  );
  expect(sharedStrings).toEqual({
    tag: 'sst',
    attrs: {
      xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      count: '2',
      uniqueCount: '2'
    },
    children: [
      {
        tag: 'si',
        attrs: {},
        children: [
          {
            tag: 't',
            attrs: {},
            children: [],
            text: 'a'
          },
          {
            tag: 'phoneticPr',
            attrs: {
              fontId: '1',
              type: 'noConversion'
            },
            children: []
          }
        ],
        text: '\n      '
      },
      {
        tag: 'si',
        attrs: {},
        children: [
          {
            tag: 'r',
            attrs: {},
            children: [
              {
                tag: 't',
                attrs: {},
                children: [],
                text: 'b'
              }
            ],
            text: '\n        '
          },
          {
            tag: 'r',
            attrs: {},
            children: [
              {
                tag: 'rPr',
                attrs: {},
                children: [
                  {
                    tag: 'sz',
                    attrs: {
                      val: '12'
                    },
                    children: []
                  },
                  {
                    tag: 'color',
                    attrs: {
                      rgb: 'FFFF0000'
                    },
                    children: []
                  },
                  {
                    tag: 'rFont',
                    attrs: {
                      val: '等线'
                    },
                    children: []
                  },
                  {
                    tag: 'family',
                    attrs: {
                      val: '3'
                    },
                    children: []
                  },
                  {
                    tag: 'charset',
                    attrs: {
                      val: '134'
                    },
                    children: []
                  }
                ],
                text: '\n          '
              },
              {
                tag: 't',
                attrs: {},
                children: [],
                text: 'c'
              }
            ],
            text: '\n        '
          },
          {
            tag: 'r',
            attrs: {},
            children: [
              {
                tag: 'rPr',
                attrs: {},
                children: [
                  {
                    tag: 'sz',
                    attrs: {
                      val: '14'
                    },
                    children: []
                  },
                  {
                    tag: 'color',
                    attrs: {
                      theme: '1'
                    },
                    children: []
                  },
                  {
                    tag: 'rFont',
                    attrs: {
                      val: '等线'
                    },
                    children: []
                  },
                  {
                    tag: 'family',
                    attrs: {
                      val: '3'
                    },
                    children: []
                  },
                  {
                    tag: 'charset',
                    attrs: {
                      val: '134'
                    },
                    children: []
                  }
                ],
                text: '\n          '
              },
              {
                tag: 't',
                attrs: {},
                children: [],
                text: 'd'
              }
            ],
            text: '\n        '
          },
          {
            tag: 'phoneticPr',
            attrs: {
              fontId: '1',
              type: 'noConversion'
            },
            children: []
          }
        ],
        text: '\n      '
      }
    ],
    text: '\n    '
  });
});

test('namespace', async () => {
  const namespace = await xml2json(
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <workbook
    xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    xmlns:r="http:// schemas.openxmlformats.org /officeDocument/2006/relationships">
    <sheets>
      <w14:sheet name="Sheet1" sheetId="1" r:id="rId1" />
    </sheets>
  </workbook>`
  );
  expect(namespace).toEqual({
    tag: 'workbook',
    attrs: {
      'xmlns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      'xmlns:r':
        'http:// schemas.openxmlformats.org /officeDocument/2006/relationships'
    },
    children: [
      {
        tag: 'sheets',
        attrs: {},
        children: [
          {
            tag: 'w14:sheet',
            attrs: {
              'name': 'Sheet1',
              'sheetId': '1',
              'r:id': 'rId1'
            },
            children: []
          }
        ],
        text: '\n    '
      }
    ],
    text: '\n  '
  });
});
