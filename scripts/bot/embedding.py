import os
from sentence_transformers import SentenceTransformer, util

model_name = 'moka-ai/m3e-base'

if os.getenv('EMBEDDING_MODEL') != None:
    model_name = os.getenv('EMBEDDING_MODEL')

model = SentenceTransformer(model_name)


def get_embedding(text):
    return model.encode(text)
