import {Type, simplifyUnionOne, generateCodes, xsd2Types} from '../xsd2Types';

test('fill', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:complexType name="CT_Stylesheet">
    <xsd:sequence>
      <xsd:element name="fills" type="CT_Fills" minOccurs="0" maxOccurs="1"/>
    </xsd:sequence>
  </xsd:complexType>
  <xsd:complexType name="CT_Fills">
    <xsd:sequence>
      <xsd:element name="fill" type="CT_Fill" minOccurs="0" maxOccurs="unbounded"/>
    </xsd:sequence>
    <xsd:attribute name="count" type="xsd:unsignedInt" use="optional"/>
  </xsd:complexType>
  <xsd:complexType name="CT_Fill">
    <xsd:choice minOccurs="1" maxOccurs="1">
      <xsd:element name="patternFill" type="CT_PatternFill" minOccurs="0" maxOccurs="1"/>
      <xsd:element name="gradientFill" type="CT_GradientFill" minOccurs="0" maxOccurs="1"/>
    </xsd:choice>
  </xsd:complexType>
  <xsd:complexType name="CT_GradientFill">
    <xsd:sequence>
      <xsd:element name="stop" type="CT_GradientStop" minOccurs="0" maxOccurs="unbounded"/>
    </xsd:sequence>
    <xsd:attribute name="type" type="ST_GradientType" use="optional" default="linear"/>
    <xsd:attribute name="degree" type="xsd:double" use="optional" default="0"/>
    <xsd:attribute name="left" type="xsd:double" use="optional" default="0"/>
    <xsd:attribute name="right" type="xsd:double" use="optional" default="0"/>
    <xsd:attribute name="top" type="xsd:double" use="optional" default="0"/>
    <xsd:attribute name="bottom" type="xsd:double" use="optional" default="0"/>
  </xsd:complexType>
  <xsd:complexType name="CT_GradientStop">
    <xsd:sequence>
      <xsd:element name="color" type="CT_Color" minOccurs="1" maxOccurs="1"/>
    </xsd:sequence>
    <xsd:attribute name="position" type="xsd:double" use="required"/>
  </xsd:complexType>
  <xsd:simpleType name="ST_GradientType">
    <xsd:restriction base="xsd:string">
      <xsd:enumeration value="linear"/>
      <xsd:enumeration value="path"/>
    </xsd:restriction>
  </xsd:simpleType>
  <xsd:complexType name="CT_PatternFill">
    <xsd:sequence>
      <xsd:element name="fgColor" type="CT_Color" minOccurs="0" maxOccurs="1"/>
      <xsd:element name="bgColor" type="CT_Color" minOccurs="0" maxOccurs="1"/>
    </xsd:sequence>
    <xsd:attribute name="patternType" type="ST_PatternType" use="optional"/>
  </xsd:complexType>
  <xsd:simpleType name="ST_PatternType">
    <xsd:restriction base="xsd:string">
      <xsd:enumeration value="none"/>
      <xsd:enumeration value="solid"/>
      <xsd:enumeration value="mediumGray"/>
      <xsd:enumeration value="darkGray"/>
      <xsd:enumeration value="lightGray"/>
      <xsd:enumeration value="darkHorizontal"/>
      <xsd:enumeration value="darkVertical"/>
      <xsd:enumeration value="darkDown"/>
      <xsd:enumeration value="darkUp"/>
      <xsd:enumeration value="darkGrid"/>
      <xsd:enumeration value="darkTrellis"/>
      <xsd:enumeration value="lightHorizontal"/>
      <xsd:enumeration value="lightVertical"/>
      <xsd:enumeration value="lightDown"/>
      <xsd:enumeration value="lightUp"/>
      <xsd:enumeration value="lightGrid"/>
      <xsd:enumeration value="lightTrellis"/>
      <xsd:enumeration value="gray125"/>
      <xsd:enumeration value="gray0625"/>
    </xsd:restriction>
  </xsd:simpleType>
  <xsd:complexType name="CT_Color">
    <xsd:attribute name="auto" type="xsd:boolean" use="optional"/>
    <xsd:attribute name="indexed" type="xsd:unsignedInt" use="optional"/>
    <xsd:attribute name="rgb" type="ST_UnsignedIntHex" use="optional"/>
    <xsd:attribute name="theme" type="xsd:unsignedInt" use="optional"/>
    <xsd:attribute name="tint" type="xsd:double" use="optional" default="0.0"/>
  </xsd:complexType>
</xsd:schema>`;

  const types = await xsd2Types(xml);

  expect(types).toEqual([
    {
      name: 'CT_Stylesheet',
      type: 'CT_Stylesheet',
      attributes: {
        fills: {
          name: 'fills',
          isArray: false,
          defaultValue: undefined,
          type: 'CT_Fills'
        }
      }
    },
    {
      name: 'CT_Fills',
      type: 'CT_Fills',
      attributes: {
        fill: {
          name: 'fill',
          isArray: true,
          defaultValue: undefined,
          type: 'CT_Fill'
        },
        count: {
          name: 'count',
          defaultValue: undefined,
          type: 'int'
        }
      }
    },
    {
      name: 'CT_Fill',
      type: 'CT_Fill',
      attributes: {
        patternFill: {
          name: 'patternFill',
          isArray: false,
          defaultValue: undefined,
          type: 'CT_PatternFill'
        },
        gradientFill: {
          name: 'gradientFill',
          isArray: false,
          defaultValue: undefined,
          type: 'CT_GradientFill'
        }
      }
    },
    {
      name: 'CT_GradientFill',
      type: 'CT_GradientFill',
      attributes: {
        stop: {
          name: 'stop',
          isArray: true,
          defaultValue: undefined,
          type: 'CT_GradientStop'
        },
        type: {
          name: 'type',
          defaultValue: 'linear',
          type: 'ST_GradientType'
        },
        degree: {
          name: 'degree',
          defaultValue: '0',
          type: 'double'
        },
        left: {
          name: 'left',
          defaultValue: '0',
          type: 'double'
        },
        right: {
          name: 'right',
          defaultValue: '0',
          type: 'double'
        },
        top: {
          name: 'top',
          defaultValue: '0',
          type: 'double'
        },
        bottom: {
          name: 'bottom',
          defaultValue: '0',
          type: 'double'
        }
      }
    },
    {
      name: 'CT_GradientStop',
      type: 'CT_GradientStop',
      attributes: {
        color: {
          name: 'color',
          isArray: false,
          defaultValue: undefined,
          type: 'CT_Color'
        },
        position: {
          name: 'position',
          defaultValue: undefined,
          type: 'double'
        }
      }
    },
    {
      name: 'ST_GradientType',
      type: 'enum',
      enum: ['linear', 'path']
    },
    {
      name: 'CT_PatternFill',
      type: 'CT_PatternFill',
      attributes: {
        fgColor: {
          name: 'fgColor',
          isArray: false,
          defaultValue: undefined,
          type: 'CT_Color'
        },
        bgColor: {
          name: 'bgColor',
          isArray: false,
          defaultValue: undefined,
          type: 'CT_Color'
        },
        patternType: {
          name: 'patternType',
          defaultValue: undefined,
          type: 'ST_PatternType'
        }
      }
    },
    {
      name: 'ST_PatternType',
      type: 'enum',
      enum: [
        'none',
        'solid',
        'mediumGray',
        'darkGray',
        'lightGray',
        'darkHorizontal',
        'darkVertical',
        'darkDown',
        'darkUp',
        'darkGrid',
        'darkTrellis',
        'lightHorizontal',
        'lightVertical',
        'lightDown',
        'lightUp',
        'lightGrid',
        'lightTrellis',
        'gray125',
        'gray0625'
      ]
    },
    {
      name: 'CT_Color',
      type: 'CT_Color',
      attributes: {
        auto: {
          name: 'auto',
          defaultValue: undefined,
          type: 'boolean'
        },
        indexed: {
          name: 'indexed',
          defaultValue: undefined,
          type: 'int'
        },
        rgb: {
          name: 'rgb',
          defaultValue: undefined,
          type: 'string'
        },
        theme: {
          name: 'theme',
          defaultValue: undefined,
          type: 'int'
        },
        tint: {
          name: 'tint',
          defaultValue: '0.0',
          type: 'double'
        }
      }
    }
  ]);
});

test('list', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:simpleType name="ST_CellSpan">
    <xsd:restriction base="xsd:string"/>
  </xsd:simpleType>
  <xsd:simpleType name="ST_CellSpans">
    <xsd:list itemType="ST_CellSpan"/>
  </xsd:simpleType>
  <xsd:complexType name="CT_Row">
    <xsd:attribute name="spans" type="ST_CellSpans" use="optional"/>
  </xsd:complexType>
</xsd:schema>`;

  const types = await xsd2Types(xml);
  expect(types).toEqual([
    {
      name: 'ST_CellSpan',
      type: 'string'
    },
    {
      name: 'ST_CellSpans',
      type: 'ST_CellSpan',
      isArray: true
    },
    {
      name: 'CT_Row',
      type: 'CT_Row',
      attributes: {
        spans: {
          name: 'spans',
          type: 'ST_CellSpans'
        }
      }
    }
  ]);
});

test('simplifyType', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:simpleType name="ST_TextScale">
    <xsd:union memberTypes="ST_TextScalePercent"/>
  </xsd:simpleType>
  <xsd:simpleType name="ST_TextScalePercent">
    <xsd:restriction base="xsd:string">
      <xsd:pattern value="0*(600|([0-5]?[0-9]?[0-9]))%"/>
    </xsd:restriction>
  </xsd:simpleType>
  <xsd:complexType name="CT_TextScale">
    <xsd:attribute name="val" type="ST_TextScale"/>
  </xsd:complexType>
</xsd:schema>`;
  const types = await xsd2Types(xml);
  expect(types).toEqual([
    {
      name: 'ST_TextScale',
      type: 'union',
      union: ['ST_TextScalePercent']
    },
    {
      name: 'ST_TextScalePercent',
      type: 'string'
    },
    {
      name: 'CT_TextScale',
      type: 'CT_TextScale',
      attributes: {
        val: {
          name: 'val',
          type: 'ST_TextScale'
        }
      }
    }
  ]);

  const code = generateCodes(types);
  console.log(code);
});

test('ST_DecimalNumber', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:complexType name="CT_DecimalNumber">
    <xsd:attribute name="val" type="ST_DecimalNumber" use="required"/>
  </xsd:complexType>
  <xsd:simpleType name="ST_DecimalNumber">
    <xsd:restriction base="xsd:integer"/>
  </xsd:simpleType>
</xsd:schema>`;
  const types = await xsd2Types(xml);

  const code = generateCodes(types);
  console.log(code);
});

test('typeprefix', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:complexType name="CT_WordprocessingCanvas">
    <xsd:sequence minOccurs="1" maxOccurs="1">
      <xsd:element name="extLst" type="a:CT_OfficeArtExtensionList" minOccurs="0" maxOccurs="1"/>
    </xsd:sequence>
  </xsd:complexType>
</xsd:schema>`;
  const types = await xsd2Types(xml);
  expect(types).toEqual([
    {
      name: 'CT_WordprocessingCanvas',
      type: 'CT_WordprocessingCanvas',
      attributes: {
        extLst: {
          name: 'extLst',
          isArray: false,
          defaultValue: undefined,
          type: 'CT_OfficeArtExtensionList'
        }
      }
    }
  ]);
});

test('mergeUnion', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:simpleType name="ST_TextBulletSize">
    <xsd:union memberTypes="ST_TextBulletSizePercent"/>
  </xsd:simpleType>
  <xsd:simpleType name="ST_TextBulletSizePercent">
    <xsd:restriction base="xsd:string">
      <xsd:pattern value="0*((2[5-9])|([3-9][0-9])|([1-3][0-9][0-9])|400)%"/>
    </xsd:restriction>
  </xsd:simpleType>
</xsd:schema>`;
  const types = await xsd2Types(xml);
  simplifyUnionOne(types);
  expect(types).toEqual([
    {
      name: 'ST_TextBulletSize',
      type: 'string'
    },
    {
      name: 'ST_TextBulletSizePercent',
      type: 'string'
    }
  ]);
});

test('cfRule', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<xsd:complexType name="CT_CfRule">
<xsd:sequence>
  <xsd:element name="formula" type="ST_Formula" minOccurs="0" maxOccurs="3"/>
</xsd:sequence>
</xsd:complexType>
</xsd:schema>`;
  const types = await xsd2Types(xml);
  simplifyUnionOne(types);
  expect(types).toEqual([
    {
      name: 'CT_CfRule',
      type: 'CT_CfRule',
      attributes: {
        formula: {
          name: 'formula',
          isArray: true,
          defaultValue: undefined,
          type: 'child-string'
        }
      }
    }
  ]);
});

test('groupref', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:complexType name="CT_Color">
      <xsd:sequence>
        <xsd:group ref="EG_ColorChoice"/>
      </xsd:sequence>
    </xsd:complexType>
    <xsd:group name="EG_ColorChoice">
      <xsd:choice>
        <xsd:element name="scrgbClr" type="CT_ScRgbColor" minOccurs="1" maxOccurs="1"/>
      </xsd:choice>
    </xsd:group>
    <xsd:complexType name="CT_ScRgbColor">
      <xsd:attribute name="r" type="ST_Percentage" use="required"/>
      <xsd:attribute name="g" type="ST_Percentage" use="required"/>
      <xsd:attribute name="b" type="ST_Percentage" use="required"/>
    </xsd:complexType>
  </xsd:schema>`;
  const types = await xsd2Types(xml);
  expect(types).toEqual([
    {
      name: 'CT_Color',
      type: 'CT_Color',
      attributes: {
        scrgbClr: {
          name: 'scrgbClr',
          isArray: false,
          defaultValue: undefined,
          type: 'CT_ScRgbColor'
        }
      }
    },
    {
      name: 'CT_ScRgbColor',
      type: 'CT_ScRgbColor',
      attributes: {
        r: {
          name: 'r',
          defaultValue: undefined,
          type: 'string'
        },
        g: {
          name: 'g',
          defaultValue: undefined,
          type: 'string'
        },
        b: {
          name: 'b',
          defaultValue: undefined,
          type: 'string'
        }
      }
    }
  ]);
});

test('any', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:complexType name="CT_Extension">
    <xsd:sequence>
      <xsd:any processContents="lax"/>
    </xsd:sequence>
    <xsd:attribute name="uri" type="xsd:token"/>
  </xsd:complexType>
</xsd:schema>`;
  const types = await xsd2Types(xml);
  expect(types).toEqual([
    {
      name: 'CT_Extension',
      type: 'CT_Extension',
      attributes: {
        __any__: {
          name: '__any__',
          type: 'any'
        },
        uri: {
          name: 'uri',
          defaultValue: undefined,
          type: 'string'
        }
      }
    }
  ]);
});

test('rid', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:complexType name="CT_Rel">
    <xsd:attribute ref="r:id" use="required"/>
  </xsd:complexType>
</xsd:schema>`;
  const types = await xsd2Types(xml);
  expect(types).toEqual([
    {
      name: 'CT_Rel',
      type: 'CT_Rel',
      attributes: {
        'r:id': {
          name: 'r:id',
          type: 'string'
        }
      }
    }
  ]);
});

test('ignore', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:complexType name="CT_Extension">
    <xsd:sequence>
      <xsd:any processContents="lax"/>
    </xsd:sequence>
    <xsd:attribute name="uri" type="xsd:token"/>
  </xsd:complexType>
  <xsd:group name="EG_ExtensionList">
    <xsd:sequence>
      <xsd:element name="ext" type="CT_Extension" minOccurs="0" maxOccurs="unbounded"/>
    </xsd:sequence>
  </xsd:group>
  <xsd:complexType name="CT_ExtensionList">
    <xsd:sequence>
      <xsd:group ref="EG_ExtensionList" minOccurs="0"/>
    </xsd:sequence>
  </xsd:complexType>
</xsd:schema>`;
  const types = await xsd2Types(xml);
  const code = generateCodes(types);
  console.log(code);
});

test('child-string-sequence', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:complexType name="CT_NumVal">
    <xsd:sequence>
      <xsd:element name="v" type="s:ST_Xstring" minOccurs="1" maxOccurs="1"/>
    </xsd:sequence>
  </xsd:complexType>
  </xsd:schema>`;
  const types = await xsd2Types(xml);
  expect(types).toEqual([
    {
      name: 'CT_NumVal',
      type: 'CT_NumVal',
      attributes: {
        v: {
          name: 'v',
          isArray: false,
          defaultValue: undefined,
          type: 'child-string'
        }
      }
    }
  ]);
});

test('child-string-element', async () => {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
  <xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <xsd:complexType name="CT_NumRef">
    <xsd:sequence>
      <xsd:element name="f" type="xsd:string" minOccurs="1" maxOccurs="1"/>
    </xsd:sequence>
  </xsd:complexType>
  </xsd:schema>`;
  const types = await xsd2Types(xml);
  expect(types).toEqual([
    {
      name: 'CT_NumRef',
      type: 'CT_NumRef',
      attributes: {
        f: {
          name: 'f',
          isArray: false,
          defaultValue: undefined,
          type: 'child-string'
        }
      }
    }
  ]);
});
