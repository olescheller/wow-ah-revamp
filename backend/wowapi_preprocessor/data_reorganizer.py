"""

This script takes the raw WoW API data, structures it to our needs and then puts into a database.

The following entities are put into the database:
    - Items
    - Auction house data
    - Item classes

"""
import json
import math
from dataclasses import dataclass
from typing import List

from dataclasses_json import DataClassJsonMixin
from pymongo import MongoClient, ASCENDING
import pandas as pd

from backend.wowapi_preprocessor import get_item_classes, get_raw_items, get_auctions

ITEM_ID = "item_id"
SELLER = "seller"
SELLER_REALM = "seller_realm"
PRICE = "price"
QUANTITY = "quantity"


@dataclass
# For dataclass see: https://docs.python.org/3/library/dataclasses.html
class IntermediateSellOrder(DataClassJsonMixin):
    """Loads a raw api auction dict and structures it into an object.

    Used to intermediate processing. Multiple of `IntermediateSellOrder`s can then be aggregated to a single instance of
    `SellOrder`.

    By inheriting `DataClassJsonMixin`, objects can be serialized simply by running .to_json().

    """

    item_id: int
    seller: str
    seller_realm: str
    price: int
    quantity: int

    def __init__(self, raw_auction_api_entry: dict):
        """ Sample `raw_auction_api_entry` object:
        
        {"auc": 1270303666, "item": 153706, "owner": "Thorn", "ownerRealm": "Arthas", "bid": 18943000,
        "buyout": 19940000, "quantity": 1, "timeLeft": "VERY_LONG", "rand": 0, "seed": 0, "context": 0}
        
        """
        self.auction_id = raw_auction_api_entry.get("auc")
        self.item_id = raw_auction_api_entry.get("item")
        self.seller = raw_auction_api_entry.get("owner")
        self.seller_realm = raw_auction_api_entry.get("ownerRealm")
        self.price = raw_auction_api_entry.get("buyout")
        self.quantity = raw_auction_api_entry.get("quantity")


@dataclass
class SellOrder(DataClassJsonMixin):
    """Used to create and store a final (aggregated) sell order."""
    item_id: int
    seller: str
    seller_realm: str
    price: int
    quantity: int


def convert_raw_api_auctions_to_sell_orders(raw_api_auctions: list) -> List[SellOrder]:
    """Converts a list of raw api auctions to a list of final Sell Orders.

    Multiple occasions of the same item_id, seller and seller_name are grouped and quantity is accumulated.
    The calculated price is the price for each of the accumulated items.

    Example:
        There are three auctions of item_id: "123", seller: "Jaina", seller_realm: "Draenor":
        {item_id: "123", seller: "Jaina", seller_realm: "Draenor", quantity: 2, price: 200000}
        {item_id: "123", seller: "Jaina", seller_realm: "Draenor", quantity: 4, price: 150000}
        {item_id: "123", seller: "Jaina", seller_realm: "Draenor", quantity: 20, price: 10000}

        The price per item is calculated in the following way (and floored):
            (2*200000 + 4*150000 + 20*10000) / (2+4+20)
           =(  400000 +   600000 +   200000) / 26
           =                        1200000  / 26
           =                                46153 (new value for price)

    """

    def create_sell_order_from_grouped_dataframe(index: tuple, row: pd.Series) -> SellOrder:
        return SellOrder(**{ITEM_ID: int(index[0]),
                            SELLER: index[1],
                            SELLER_REALM: index[2],
                            QUANTITY: int(row[QUANTITY]),
                            PRICE: int(row[PRICE]),
                            })

    intermediate_auctions = list(map(IntermediateSellOrder, raw_api_auctions))
    df = pd.DataFrame(list(map(lambda i_auction: json.loads(i_auction.to_json()), intermediate_auctions)))
    grouped = df.groupby([ITEM_ID, SELLER, SELLER_REALM])
    aggregated = grouped.apply(aggregate_quantity_and_price)

    sell_orders = []
    for index, row in aggregated.iterrows():
        sell_orders.append(create_sell_order_from_grouped_dataframe(index, row))

    return sell_orders


def aggregate_quantity_and_price(df: pd.DataFrame):
    """This function is used to aggregate the price correctly to represent the price per item.

    `df` is a grouped data frame containing all auctions for a key (item_id, seller, seller_realm).

    """
    return pd.Series({QUANTITY: df[QUANTITY].sum(),
                      PRICE: math.floor((df[PRICE] * df[QUANTITY]).sum() / df[QUANTITY].sum())},
                     index=['quantity', 'price'])


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
    # db = MongoDbAdapter()
    # db.delete_all()
    # db.insert_item_classes()
    # db.insert_items()

    auctions = get_auctions()
    sell_orders = convert_raw_api_auctions_to_sell_orders(auctions)

    print(sell_orders)
