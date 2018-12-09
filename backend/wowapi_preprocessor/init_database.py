"""

This script takes the raw WoW API data, structures it to our needs and then puts into a database.

The following entities are put into the database:
    - Items
    - Auction house data
    - Item classes

"""
from pymongo import MongoClient, ASCENDING

from backend.wowapi_preprocessor import get_item_classes, get_raw_items


def create_rehashed_item_object(wow_api_item):
    """Creates a rehashed item from a raw WoW API item."""
    return {
        "id": wow_api_item.get("id"),
        "name": wow_api_item.get("name"),
        "icon": wow_api_item.get("icon"),
        "is_stackable": False if wow_api_item.get("stackable") == 1 else True,
        "item_class": wow_api_item.get("itemClass"),
        "item_sub_class": wow_api_item.get("itemSubClass")
    }


class MongoDbAdapter:
    def __init__(self, addr: str = 'localhost', port: int = 27017):
        self._client = MongoClient(addr, port)
        self._wow_db = "wow_data"
        self._wow_items_collection = "items"
        self._wow_item_classes_collection = "itemclasses"

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
                                       [create_rehashed_item_object(item) for item in
                                        get_raw_items()])

    def delete_all(self):
        self._client[self._wow_db][self._wow_item_classes_collection].delete_many({})
        self._client[self._wow_db][self._wow_items_collection].delete_many({})


if __name__ == '__main__':
    mongodb = MongoDbAdapter()
    mongodb.delete_all()
    mongodb.insert_item_classes()
    mongodb.insert_items()
