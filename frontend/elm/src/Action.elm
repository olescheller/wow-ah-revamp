module Action exposing (Msg(..))

import Graphql.Http
import State exposing (InventorySlot, Item, ItemSupply, Price, Receipt, Route, SellOrder, User)


type Msg
    = SetCurrentRoute Route
    | RequestItemDetail Item
    | SetItemDetail Item (Result (Graphql.Http.Error ()) (Maybe ItemSupply))
    | EnterSearchValue String
    | SearchItemSupplies
    | GotItemResponse (Result (Graphql.Http.Error ()) (Maybe Item))
    | GotItemSupplyResponse (Result (Graphql.Http.Error ()) (Maybe (List (Maybe ItemSupply))))
    | EnterQuantity String String
    | GotItemPriceResponse String (Result (Graphql.Http.Error ()) (Maybe Price))
    | BuyItem String Item Int Float Float
    | GotBuyItemResponse (Result (Graphql.Http.Error ()) (Maybe Receipt))
    | GetInitialInventory (Result (Graphql.Http.Error ()) (List (Maybe InventorySlot)))
    | FetchUser (Result (Graphql.Http.Error ()) (Maybe User))
    | GotInitialSellOrders (Result (Graphql.Http.Error ()) (Maybe (List (Maybe SellOrder))))
    | DeleteSellOrder SellOrder
    | GotDeleteSellOrderResponse (Result (Graphql.Http.Error ()) Bool)
    | SellItem
    | EnterSellQuantity String
    | EnterSellPrice String
    | SoldItem (Result (Graphql.Http.Error ()) SellOrder)



-- GotItemPriceResponse "ole"
