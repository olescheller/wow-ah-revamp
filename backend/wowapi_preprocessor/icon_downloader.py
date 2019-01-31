"""Download icons for all items present in data/items.json and store them in data/icons/"""
import json
import os
import shutil
import threading
from time import sleep
from typing import List

import requests

DATA_DIR = os.path.join("..", "data")
ICON_DATA_DIR = os.path.join("..", "..", "frontend", "react", "public", "icons")


def create_icon_path(icon_name: str) -> str:
    return os.path.join(ICON_DATA_DIR, f"{icon_name}.jpg")


def download_and_save_icon(icon_name: str):
    download_url = f"https://wow.zamimg.com/images/wow/icons/large/{icon_name}.jpg"
    request = requests.get(download_url, stream=True)
    if request.status_code == 200:
        with open(create_icon_path(icon_name), 'wb') as f:
            request.raw.decode_content = True
            shutil.copyfileobj(request.raw, f)


def get_icon_names_from_items_file(item_file_path: str) -> List[str]:
    """Return a list of icon names."""
    with open(item_file_path, 'r') as f:
        items = json.loads(f.read())["items"]
        return [i["icon"] for i in items if i.get("icon")]


def icon_exists(icon_name: str) -> bool:
    return os.path.isfile(os.path.join(ICON_DATA_DIR, f"{icon_name}.jpg"))


if __name__ == '__main__':

    icons = get_icon_names_from_items_file("../data/items.json")
    batch_size = 100
    seconds_per_batch = 1

    icon_batches = [icons[x:x + batch_size] for x in range(0, len(icons), batch_size)]

    for icon_batch in icon_batches:
        threads = []
        print(f"Downloading batch: {icon_batch}")
        for icon in icon_batch:
            if not icon_exists(icon):
                thread = threading.Thread(target=download_and_save_icon, args=(icon,))
                thread.start()
                threads.append(thread)

        [t.join() for t in threads]
        if len(threads) > 10:
            sleep(seconds_per_batch)
