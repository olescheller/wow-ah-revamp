module Action exposing (Msg(..))

import Graphql.Http
import State exposing (InventorySlot, Item, ItemSupply, Price, Receipt, Route , User)


type Msg
    = SetCurrentRoute Route
    | RequestItemDetail String
    | SetItemDetail (Result (Graphql.Http.Error ()) (Maybe ItemSupply))
    | EnterSearchValue String
    | SearchItemSupplies
    | GotItemResponse (Result (Graphql.Http.Error ()) (Maybe Item))
    | GotItemSupplyResponse (Result (Graphql.Http.Error ()) (Maybe (List (Maybe ItemSupply))))
    | EnterQuantity String String
    | GotItemPriceResponse String (Result (Graphql.Http.Error ()) (Maybe Price))
    | BuyItem String Int Int Float Float
    | GotBuyItemResponse (Result (Graphql.Http.Error ()) (Maybe Receipt))
    | GetInitialInventory (Result (Graphql.Http.Error ()) (List (Maybe (InventorySlot))))
    | FetchUser (Result (Graphql.Http.Error ()) (Maybe User))



-- GotItemPriceResponse "ole"
