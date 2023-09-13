from vector_store import get_client
from split_markdown import split_markdown
from embedding import get_embedding
import gradio as gr
import os
import pickle
from llm.wenxin import Wenxin, ModelName
from dotenv import load_dotenv
load_dotenv()


chroma_client = get_client()
collection = chroma_client.get_collection(name="amis")

wenxin = Wenxin()

text_blocks_by_id = {}
with open(os.path.join(os.path.dirname(__file__), 'text.pickle'), 'rb') as f:
    text_blocks_by_id = pickle.load(f)


def get_prompt(context, query):
    return f"""
请只根据下面的资料回答问题，如果无法根据这些资料回答，回答“找不到相关答案”：

资料：
{context}

问题是：{query}
回答："""


def get_context(search_result, include_code=True, max_length=1024):
    context = ""
    doc_ids = []
    for doc_id in search_result['ids'][0]:
        doc_id = doc_id.split("_")[0]
        if doc_id not in doc_ids:
            doc_ids.append(doc_id)

    for doc_id in doc_ids:
        markdown_block = text_blocks_by_id[doc_id]
        block_text = markdown_block.gen_text(512, include_code)
        if (len(context) + len(block_text)) < max_length:
            context += block_text + "\n\n"

    return context


query = gr.Textbox(label="问题")
include_code = gr.Checkbox(value=True, label="提示词中是否要包含 amis schema",
                           info="包含的好处是大模型会返回 json，但也会导致内容太长，只能提供少量段落给大模型，导致错过重要资料")
n_result = gr.Number(
    value=10, precision=0, label="向量搜索查询返回个数")


bot_result = gr.Textbox(label="文心的回答")
bot_turbo_result = gr.Textbox(label="文心 Turbo 的回答")
booomz_result = gr.Textbox(label="开源 BLOOMZ 的回答")
prompt = gr.Textbox(label="提示词")
vector_search_result = gr.Dataframe(
    label="向量相关搜索结果，这个结果只是为了辅助调试，确认是因为没找到相关内容还是大模型没能理解",
    headers=["相关段落", "所属文档"],
    datatype=["str", "str"],
    col_count=(2, "dynamic"),
    wrap=True
)


def amis_search(query, n_result=10, include_code=True):
    if query.strip() == "":
        return "必须有输入", "", "", []

    search_result = collection.query(
        query_embeddings=get_embedding(query).tolist(),
        n_results=n_result
    )

    context = get_context(search_result, include_code)

    if (context == ""):
        return "检索不到相关内容", "", "", []

    prompt = get_prompt(context, query)
    bot_result = wenxin.generate(prompt, ModelName.ERNIE_BOT)
    # bloomz_result = wenxin.generate(prompt, ModelName.BLOOMZ_7B)
    markdown_blocks = []
    index = 0
    for doc in search_result['documents'][0]:
        markdown_block = []
        markdown_block.append(doc)
        if index < len(search_result['metadatas'][0]):
            source = search_result['metadatas'][0][index]['source'].replace(
                'docs/zh-CN/', '')
            markdown_block.append(
                source)
        else:
            print("index out of range", doc)

        markdown_blocks.append(markdown_block)
        index += 1

    return bot_result, prompt, markdown_blocks


demo = gr.Interface(amis_search, title="amis 文档问答机器人", inputs=[
                    query, n_result, include_code], outputs=[bot_result, prompt, vector_search_result])


if __name__ == '__main__':
    demo.queue(concurrency_count=10).launch(share=False, server_name="0.0.0.0")
