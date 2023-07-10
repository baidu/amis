import sys
import os
import glob
import uuid
import pickle
from embedding import get_embedding
from split_markdown import split_markdown
from vector_store import get_client

chroma_client = get_client()
# 每次执行都会清理避免重复
chroma_client.reset()
collection = chroma_client.create_collection(name="amis")

doc_dir = sys.argv[1]

# 存储所有文本段用于大模型生成
text_blocks_by_id = {}

# embedding 缓存，虽然目前速度很快，但后续如果换成网络请求会比较慢
embedding_cache = {}

embedding_cache_file = os.path.join(
    os.path.dirname(__file__), 'embedding.pickle')

if os.path.exists(embedding_cache_file):
    with open(embedding_cache_file, 'rb') as f:
        embedding_cache = pickle.load(f)


def get_embedding_with_cache(text):
    if text in embedding_cache:
        return embedding_cache[text]
    else:
        embedding = get_embedding(text).tolist()
        embedding_cache[text] = embedding
        return embedding


for filename in glob.iglob(doc_dir + '**/*.md', recursive=True):
    with open(filename) as f:
        content = f.read()
        md_blocks = split_markdown(content, filename)
        embeddings = []
        documents = []
        metadatas = []
        ids = []
        for block in md_blocks:
            block_id = uuid.uuid4().hex
            text_blocks_by_id[block_id] = block
            text_blocks = block.get_text_blocks()
            index = 1
            for text_block in text_blocks:
                embeddings.append(get_embedding_with_cache(text_block))
                documents.append(text_block)
                ids.append(block_id + "_" + str(index))
                metadatas.append({"source": block.file_name})
                index += 1

        collection.add(
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )


with open(os.path.join(os.path.dirname(__file__), 'text.pickle'), 'wb') as f:
    pickle.dump(text_blocks_by_id, f, pickle.HIGHEST_PROTOCOL)

with open(embedding_cache_file, 'wb') as f:
    pickle.dump(embedding_cache, f, pickle.HIGHEST_PROTOCOL)
