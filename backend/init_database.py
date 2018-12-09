"""

This script takes the raw WoW API data, structures it to our needs and then puts into a database.

"""
import json
import os
from typing import List

from pymongo import MongoClient, ASCENDING


def get_raw_items() -> List:
    with open(os.path.abspath("wowdata/items.json"), 'r') as f:
        return json.load(f).get("items")


def get_item_classes() -> List:
    with open(os.path.abspath("wowdata/itemClasses.json"), 'r') as f:
        return json.load(f).get("classes")


def get_valid_item_classes(itemclasses) -> List:
    return [cls.get("class") for cls in itemclasses]


def create_rehashed_item_object(wow_api_item, itemclasses):
    item = {}
    item["id"] = wow_api_item.get("id")
    item["name"] = wow_api_item.get("name")
    item["icon"] = wow_api_item.get("icon")
    item["is_stackable"] = False if wow_api_item.get("stackable") == 1 else True
    if wow_api_item.get("itemClass") in get_valid_item_classes(itemclasses):
        item["item_class"] = wow_api_item.get("itemClass")

    item["item_sub_class"] = wow_api_item.get("itemSubClass")
    return item


class DbAdapter:
    def __init__(self, addr: str = 'localhost', port: int = 27017):
        self._client = MongoClient(addr, port)
        self._wow_db = "wow_data"
        self._wow_items_collection = "items"
        self._wow_item_classes_collection = "itemclasses"
        self._item_classes_cache = get_item_classes()

        # create indexes
        self._client[self._wow_db][self._wow_item_classes_collection].create_index([('class', ASCENDING)], unique=True)
        self._client[self._wow_db][self._wow_items_collection].create_index([('id', ASCENDING)], unique=True)
        self._client[self._wow_db][self._wow_items_collection].create_index([('item_class', ASCENDING)])
        self._client[self._wow_db][self._wow_items_collection].create_index([('item_sub_class', ASCENDING)])

    def __insert_many_to_mongo_db(self, database: str, collection: str, object):
        self._client[database][collection].insert_many(object)

    def insert_item_classes(self):
        self.__insert_many_to_mongo_db(self._wow_db, self._wow_item_classes_collection,
                                       get_item_classes())

    def insert_items(self):
        self.__insert_many_to_mongo_db(self._wow_db, self._wow_items_collection,
                                       [create_rehashed_item_object(item, self._item_classes_cache) for item in
                                        get_raw_items()])


mongodb = DbAdapter()
# mongodb.insert_item_classes()
mongodb.insert_items()
