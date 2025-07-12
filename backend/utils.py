# backend/utils.py  (new small file)
def stringify_id(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc
