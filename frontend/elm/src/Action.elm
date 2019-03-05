module Action exposing (..)

import Graphql.Http
import State exposing (Item, ItemSupply, Route)


type Msg
    = SelectedRoute Route |
    GotItemResponse (Result (Graphql.Http.Error ()) (Maybe Item)) |
    GotItemSupplyResponse (Result (Graphql.Http.Error ()) (Maybe (List (Maybe ItemSupply))))