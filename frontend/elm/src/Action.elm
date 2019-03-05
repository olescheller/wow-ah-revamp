module Action exposing (Msg(..))

import Graphql.Http
import State exposing (Item, ItemSupply, Route)


type Msg
    = SetCurrentRoute Route
    | EnterSearchValue String
    | SearchItemSupplies
    | GotItemResponse (Result (Graphql.Http.Error ()) (Maybe Item))
    | GotItemSupplyResponse (Result (Graphql.Http.Error ()) (Maybe (List (Maybe ItemSupply))))