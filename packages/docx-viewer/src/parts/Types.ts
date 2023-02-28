/**
 * 解析 [Content_Types].xml
 */

interface Override {
  partName: string;
  contentType: string;
}

export default class Types {
  overrides: Override[] = [];

  static parse(data: any) {
    const types = new Types();
    const typesData = data['Types'];
    if (typesData) {
      const overrideData = typesData['Override'];
      if (overrideData) {
        types.overrides = overrideData.map((item: any) => {
          return {
            partName: item['@_PartName'],
            contentType: item['@_ContentType']
          };
        });
      }
    }

    return types;
  }
}
