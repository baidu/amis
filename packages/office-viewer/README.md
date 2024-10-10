# 说明

Word 和 Excel 渲染器，目前接口还未完全稳定，新版可能会修改，请参考 examples

## Word 渲染

### 原理

Word 渲染器，原理是将 docx 里的 xml 格式转成 html

相对于 Canvas 渲染，这个实现方案比较简单，最终页面也可以很方便复制，但无法保证和原始 docx 文件展现一致，因为有部分功能难以在 HTML 中实现，比如图文环绕效果。

### 已知不支持的功能

- 艺术字
- 域
- 对象
- wmf，需要使用 https://github.com/SheetJS/js-wmf

### 参考资料

- [官方规范](https://www.ecma-international.org/publications-and-standards/standards/ecma-376/)
- [标签的在线文档](http://webapp.docx4java.org/OnlineDemo/ecma376/WordML/index.html)

日常开发可以使用 [OOXML viewer](https://marketplace.visualstudio.com/items?itemName=yuenm18.ooxml-viewer) 插件查看

开发过程啊参考了

- [docx](https://github.com/dolanmiu/docx) 的类型定义
- [docxjs](https://github.com/zVolodymyr/docxjs) 里格式的实现

## Excel 渲染

### 原理

使用 Canvas 渲染
