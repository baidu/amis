
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return "use /query/{query}"


@app.get("/amis-doc-query/{query}")
def read_item(query: str):
    return {"item_id": "d"}
