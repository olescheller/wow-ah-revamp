module Queries exposing (item, itemQuery, itemSupply, itemSupplyQuery, makeRequest)

-- GRAPHQL

import Action exposing (Msg(..))
import Gqllib.Object
import Gqllib.Object.Item as Item
import Gqllib.Object.ItemSupply as ItemSupply
import Gqllib.Query as Query
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet, hardcoded, with)
import Html exposing (Html)
import Json.Decode exposing (..)
import Maybe exposing (Maybe, withDefault)
import State exposing (Item, ItemSupply, Route)


makeRequest query message =
    query
        |> Graphql.Http.queryRequest "http://localhost:4000/"
        |> Graphql.Http.send
            (Graphql.Http.discardParsedErrorData
                >> message
            )


itemQuery : SelectionSet (Maybe Item) RootQuery
itemQuery =
    Query.item { id = 25 } item


item : SelectionSet Item Gqllib.Object.Item
item =
    SelectionSet.map3 Item
        Item.name
        Item.id
        Item.icon


itemSupplyQuery : String -> SelectionSet (Maybe (List (Maybe ItemSupply))) RootQuery
itemSupplyQuery searchValue =
    Query.items_supply { partialItemName = searchValue } itemSupply


itemSupply : SelectionSet ItemSupply Gqllib.Object.ItemSupply
itemSupply =
    SelectionSet.map4 ItemSupply
        ItemSupply.id
        (ItemSupply.item <| item)
        ItemSupply.quantity
        ItemSupply.min_price
