from .base import LLM
import requests
from functools import lru_cache
import time
import os
import json
from enum import Enum
from requests.exceptions import HTTPError

base_url = 'https://aip.baidubce.com'


class ModelName(Enum):
    ERNIE_BOT = 1
    ERNIE_BOT_TURBO = 2
    BLOOMZ_7B = 3


def get_ttl_hash(seconds=3600):
    """缓存一小时"""
    return round(time.time() / seconds)


@lru_cache(maxsize=1)
def get_token(ttl_hash=None):
    """
    根据 ak/sk 获取 access_token
    """
    del ttl_hash
    ak = os.getenv('WENXIN_AK')
    sk = os.getenv('WENXIN_SK')
    url = f'{base_url}/oauth/2.0/token?grant_type=client_credentials&client_id={ak}&client_secret={sk}'
    response = requests.get(url)
    response.raise_for_status()
    return response.json()['access_token']


def query(query: str, token: str, model_name: ModelName = ModelName.ERNIE_BOT_TURBO):
    """
    参考文档
    https://cloud.baidu.com/doc/WENXINWORKSHOP/s/jlil56u11
    """

    # 目前暂时写死
    user_id = os.getenv('WENXIN_USER_ID')
    model_path = "eb-instant"
    if model_name == ModelName.BLOOMZ_7B:
        model_path = "bloomz_7b1"
    elif model_name == ModelName.ERNIE_BOT:
        model_path = "completions"
    url = f'{base_url}/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/{model_path}?access_token={token}&user_id={user_id}'
    messages = [{'role': 'user', 'content': query}]
    payload = {
        'messages': messages
    }
    headers = {
        'content-type': 'application/json',
    }
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    response.raise_for_status()
    return response.json()["result"]


class Wenxin(LLM):
    """文心千帆大模型"""

    def generate(self, prompt: str, model_name: ModelName = ModelName.ERNIE_BOT_TURBO) -> str:
        try:
            return query(prompt, get_token(ttl_hash=get_ttl_hash()), model_name)
        except HTTPError as e:
            return f'HTTPError: {e}'
