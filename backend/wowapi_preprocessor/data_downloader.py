"""
This script downloads raw WoW API data and saves it into json files.

The downloaded data shall be committed to the git repository in folder `wowdata`.
The data must be saved locally so we don't have to fetch the (slow) WoW API all the time.

Data downloaded:
    - auction house snapshot
    - items

Environment variables must be set with values from a WoW API account:
    - WOW_CLIENT_ID
    - WOW_CLIENT_SECRET

"""

import json
import os
import threading
from time import sleep

import requests
from wowapi import WowApi

from backend.wowapi_preprocessor import wowdata_dir, wowdata_items_path, wowdata_auction_house_path


def download_item(item_id: int, new_item_list: list):
    new_item_list.append(api.get_item('eu', item_id))


# Setup
api = WowApi(os.environ['WOW_CLIENT_ID'], os.environ['WOW_CLIENT_SECRET'])
realm = 'antonidas'
region = 'eu'

# Create files if they don't exist
if not os.path.isdir(wowdata_dir):
    os.makedirs(wowdata_dir)

if not os.path.isfile(wowdata_items_path):
    with open(wowdata_items_path, "x+") as f:
        f.write(json.dumps({"items": []}))

if not os.path.isfile(wowdata_auction_house_path):
    with open(wowdata_auction_house_path, "x+") as f:
        f.write(json.dumps({"auctions": [], "last_modified": 0}))

"""
# Get auctions
"""

# Check if local auction house data needs update
with open(wowdata_auction_house_path, "r") as f:
    raw_data = f.read()
    if raw_data != "":
        data = json.loads(raw_data)
        local_last_modified = data.get('last_modified', 0)
        auctions = data.get("auctions", {})
    else:
        local_last_modified = 0
        auctions = {}

auctions_api_data = api.get_auctions(region, realm, locale='en_US')
last_modified = auctions_api_data.get("files")[0].get("lastModified")

if local_last_modified + 900 < last_modified:  # data is at least 15 minutes old
    print("Downloading auction data ...")
    auctions = requests.get(auctions_api_data.get("files")[0].get("url")).json().get("auctions")

    # Buffer auctions to file
    with open(wowdata_auction_house_path, "w+") as f:
        json.dump({"auctions": auctions, "last_modified": last_modified}, f)

"""
Check which items from new auctions data are not in our local items file yet
"""
print("Check which items need download ...")

with open(wowdata_items_path, "r") as f:
    auctions_api_data = f.read()
    existing_item_ids = [item.get("id") for item in
                         json.loads(auctions_api_data).get("items", [])] if auctions_api_data != '' else []

item_ids = list(set([auction.get('item') for auction in auctions if (auction.get('item') not in existing_item_ids)]))

"""
# Get unknown items and save to raw items file
# Downloading must be done in batches of 100 (WoW API limit) with breaks of 1 second after each batch
"""

print(f"Processing {len(item_ids)} items ...")
if len(item_ids) > 0:

    item_ids_batches = [item_ids[x:x + 100] for x in range(0, len(item_ids), 100)]

    # Read current item data from file
    with open(wowdata_items_path, "r") as f:
        auctions_api_data = f.read()
        if auctions_api_data != '':
            item_data = json.loads(auctions_api_data)
        else:
            item_data = {"items": []}

    new_items = []
    for item_ids_batch in item_ids_batches:

        # Create threads for each request
        print(f"Procesing item batch {item_ids_batch} ...")
        threads = []
        for item_id in item_ids_batch:
            thread = threading.Thread(target=download_item, args=(item_id, new_items))
            thread.start()
            threads.append(thread)
        [t.join() for t in threads]

        print("Waiting two seconds after each batch of 100 items.")
        sleep(2)

    print("Saving results to disk ...")
    with open(wowdata_items_path, "w+") as f:
        item_data.get('items').extend(new_items)
        json.dump(item_data, f, indent=2)
