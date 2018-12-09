import json
import os
from typing import List

wowdata_dir = os.path.abspath("../wowdata")
wowdata_items_path = os.path.join(wowdata_dir, "items.json")
wowdata_auction_house_path = os.path.join(wowdata_dir, "ah.json")
wowdata_item_classes_path = os.path.join(wowdata_dir, "itemClasses.json")


def get_auctions() -> List:
    """Returns a list of auctions read from the local json file."""
    with open(wowdata_auction_house_path, 'r') as f:
        return json.load(f).get("auctions")


def get_raw_items() -> List:
    """Returns a list of items read from the local json file."""
    with open(wowdata_items_path, 'r') as f:
        return json.load(f).get("items")


def get_item_classes() -> List:
    """Returns a list of item classes read from the local json file."""
    with open(wowdata_item_classes_path, 'r') as f:
        return json.load(f).get("classes")


def get_valid_item_classes(item_classes) -> List:
    """Returns a list of valid item class ids."""
    return [cls.get("class") for cls in item_classes]
