"""
This script downloads raw WoW API data and saves it into json files.

The downloaded data shall be committed to the git repository in folder `wowdata`.
The data must be saved locally so we don't have to fetch the (slow) WoW API all the time.

Data downloaded:
    - items

"""

import json
import os
import threading
from time import sleep

import requests
from wowapi import WowApi


def download_item(item_id: int, new_item_list: list):
    # with open(os.path.abspath(os.path.join(save_dir, "{}.json".format(item_id))), "w+") as f:
    #     f.write(json.dumps(api.get_item('eu', item_id), indent=2))

    new_item_list.append(api.get_item('eu', item_id))


# Setup
api = WowApi(os.environ['WOW_CLIENT_ID'], os.environ['WOW_CLIENT_SECRET'])
wowdata_items_path = os.path.abspath("wowdata/items.json")

"""
# 1. Get auctions
"""

print("Downloading auction data ...")
auctions_api_data = api.get_auctions('eu', 'draenor', locale='en_US')
auctions = requests.get(auctions_api_data.get("files").pop(0).get("url")).json().get("auctions")

"""
 2. Buffer auctions to own db
"""

"""
3. Check which items  from new auctions data are not in our local items file yet
"""
print("Check which items need download ...")

with open(wowdata_items_path, "r") as f:
    auctions_api_data = f.read()
    existing_item_ids = [item.get("id") for item in
                         json.loads(auctions_api_data).get("items", [])] if auctions_api_data != '' else []

item_ids = list(set([auction.get('item') for auction in auctions if (auction.get('item') not in existing_item_ids)]))

"""
# 4. Get unknown items and save to raw items file
#    Downloading must be done in batches of 100 (WoW API limit)
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

    with open(wowdata_items_path, "w+") as f:
        item_data.get('items').extend(new_items)
        json.dump(item_data, f, indent=2)
