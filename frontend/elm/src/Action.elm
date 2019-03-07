module Action exposing (Msg(..))

import Graphql.Http
import State exposing (Item, ItemSupply, Price, Route)


type Msg
    = SetCurrentRoute Route
    | EnterSearchValue String
    | SearchItemSupplies
    | GotItemResponse (Result (Graphql.Http.Error ()) (Maybe Item))
    | GotItemSupplyResponse (Result (Graphql.Http.Error ()) (Maybe (List (Maybe ItemSupply))))
    | EnterQuantity String String
    | GotItemPriceResponse String (Result (Graphql.Http.Error ()) (Maybe Price))



-- GotItemPriceResponse "ole"
