import {xmlToNode} from '../xmlToNode';

test('simple', () => {
  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <row r="2" spans="1:3">
  <c r="A2">
    <f t="array" ref="A2">SUM(B1:C1*B2:C2)</f>
    <v>0</v>
  </c>
  <c r="B2">
    <v>10</v>
  </c>
  <c r="C2">
    <v>15</v>
  </c>
</row>`;

  const node = xmlToNode(xml);

  expect(node).toStrictEqual({
    tag: 'row',
    attrs: {
      r: '2',
      spans: '1:3'
    },
    children: [
      {
        tag: 'c',
        attrs: {
          r: 'A2'
        },
        children: [
          {
            tag: 'f',
            attrs: {
              t: 'array',
              ref: 'A2'
            },
            children: [],
            text: 'SUM(B1:C1*B2:C2)'
          },
          {
            tag: 'v',
            attrs: {},
            children: [],
            text: '0'
          }
        ],
        text: ''
      },
      {
        tag: 'c',
        attrs: {
          r: 'B2'
        },
        children: [
          {
            tag: 'v',
            attrs: {},
            children: [],
            text: '10'
          }
        ],
        text: ''
      },
      {
        tag: 'c',
        attrs: {
          r: 'C2'
        },
        children: [
          {
            tag: 'v',
            attrs: {},
            children: [],
            text: '15'
          }
        ],
        text: ''
      }
    ],
    text: ''
  });
});

test('sst', () => {
  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="22" uniqueCount="22">
    <si>
      <r>
        <rPr>
          <sz val="12"/>
          <color rgb="FFFF0000"/>
          <rFont val="等线"/>
          <family val="4"/>
          <charset val="134"/>
        </rPr>
        <t>rich</t>
      </r>
    </si>
  </sst>`;

  const node = xmlToNode(xml);

  expect(node).toStrictEqual({
    tag: 'sst',
    attrs: {
      xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      count: '22',
      uniqueCount: '22'
    },
    children: [
      {
        tag: 'si',
        attrs: {},
        children: [
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
                      val: '4'
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
                text: ''
              },
              {
                tag: 't',
                attrs: {},
                children: [],
                text: 'rich'
              }
            ],
            text: ''
          }
        ],
        text: ''
      }
    ],
    text: ''
  });
});
