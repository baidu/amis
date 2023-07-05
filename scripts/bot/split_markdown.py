import sys
import re
from enum import Enum
from dataclasses import dataclass, field
from markdown import Markdown
from io import StringIO


def unmark_element(element, stream=None):
    if stream is None:
        stream = StringIO()
    if element.text:
        stream.write(element.text)
    for sub in element:
        unmark_element(sub, stream)
    if element.tail:
        stream.write(element.tail)
    return stream.getvalue()


# patching Markdown
Markdown.output_formats["plain"] = unmark_element
__md = Markdown(output_format="plain")
__md.stripTopLevelTags = False


def unmark(text):
    """去掉文本样式，参考 https://stackoverflow.com/questions/761824/python-how-to-convert-markdown-formatted-text-to-text"""
    return __md.convert(text)


class ContentType(Enum):
    Text = 1
    Code = 2


# 最长段落
LONG_CONTENT_LENGTH = 20


@dataclass
class BlockContent:
    """文本段中的文本或代码"""
    type: ContentType
    text: str


@dataclass
class MarkdownBlock:
    """文档段，这个是给大模型上下文的最小单位"""

    # 文件名
    file_name: str
    # 文件标题
    title: str = ""
    # 二级或三级标题
    header: str = ""
    # 内容，可能是文本或代码段
    content: list[ContentType] = field(default_factory=list)

    def gen_text(self, max_length: int = 500, include_code=True) -> str:
        """"输出文本"""
        current_length = 0
        output = self.header + "\n\n" if self.header else ""
        for para in self.content:
            content = para.text
            # 超过长度限制了就中断，这里其实没考虑代码段 ``` 多出来的 10 个字符
            if current_length + len(content) > max_length:
                break
            if para.type == ContentType.Code and include_code:
                output += f"\n```\n{content}\n```\n"
            else:
                output += content + "\n"
            current_length += len(content)

        return output

    def get_text_blocks(self) -> list[str]:
        """获取用于生成嵌入的文本段落列表"""
        blocks: list[str] = []
        header = self.header.replace("#", "") if self.header else ""
        if header != "":
            if len(header) < 4:
                blocks.append(self.title + header)
            else:
                blocks.append(header)
        all_text = ""
        for para in self.content:
            if para.type == ContentType.Text:
                # 去掉各种样式及图片避免影响
                text = unmark(para.text)
                all_text += text
                blocks.append(self.title + header + text)
                blocks.append(text)
                # 对于太长的段落，拆分一下
                if len(text) > LONG_CONTENT_LENGTH:
                    for line in text.split("，"):
                        blocks.append(line)

        if len(all_text) < LONG_CONTENT_LENGTH:
            blocks.append(header + all_text)

        # 删掉重复的和避免空字符
        output_blocks = set()
        for block in blocks:
            block = block.strip()
            if block != "" and block not in output_blocks:
                output_blocks.add(block)
        return list(output_blocks)


def split_markdown(markdown_text: str, file_name: str) -> list[MarkdownBlock]:
    """
    拆分 Markdown 文档为段落
    """
    markdown_text = markdown_text.replace("\r\n", "\n").replace("\r", "\n")

    # 文档标题
    title = ""

    lines = markdown_text.split("\n")
    # markdown 段落
    blocks: list[MarkdownBlock] = []

    # 当前二级标题
    current_header = None
    current_content: list[BlockContent] = []
    # 代码需要合并到一起，所以先收集
    current_code: list[str] = []
    # 是否在代码快中
    in_code_block = False

    # 文档元数据
    in_meta = False

    for line in lines:
        # 处理文档元数据
        if line.startswith("---"):
            in_meta = not in_meta
            continue

        if in_meta and ":" in line:
            key, value = line.split(":")
            if key == "title":
                title = value.strip()
            continue

        # 这是版本说明，没什么用
        if line.startswith("> ") and "以上版本" in line:
            continue

        if line.startswith(">"):
            line = line.replace(">", "")

        if line.strip() == "":
            continue

        header_match = re.match(r"^#+\s", line)
        # 匹配到了标题
        if header_match:
            # 如果之前有标题，那么这就是新的一段
            if current_header is not None:
                # 至少要有内容或者代码块
                if len(current_content) > 0:
                    blocks.append(MarkdownBlock(file_name, title,
                                                current_header, current_content))
                    current_content = []
                    current_code = []
            # 开启新段落解析
            current_header = line

        else:
            # 说明是刚开始的文本，没有标题
            if current_header is None:
                current_content.append(BlockContent(ContentType.Text, line))
                blocks.append(MarkdownBlock(file_name, title,
                                            current_header, current_content))
                current_content = []
            else:
                # 说明是代码块
                if line.startswith("```"):
                    in_code_block = not in_code_block
                    if not in_code_block:
                        current_content.append(BlockContent(
                            ContentType.Code, "\n".join(current_code)))
                        current_code = []
                else:
                    if in_code_block:
                        current_code.append(line)
                    else:
                        current_content.append(
                            BlockContent(ContentType.Text, line))

    if len(current_content) > 0 or len(current_code) > 0:
        blocks.append(MarkdownBlock(file_name, title,
                                    current_header, current_content))

    return blocks


def test(file_name: str):
    with open(file_name) as f:
        content = f.read()
        blocks = split_markdown(content, file_name)
        for block in blocks:
            print(block.getText())


if __name__ == '__main__':
    test(sys.argv[1])
