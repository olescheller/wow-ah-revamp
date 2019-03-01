module Action exposing (..)

import Graphql.Http
import State exposing (Item, Route)


type Msg
    = SelectedRoute Route |
    GotResponse (Result (Graphql.Http.Error ()) (Maybe Item))