module Queries exposing (item, itemPriceQuery, itemQuery, itemSupply, itemSupplyQuery, makeRequest)

-- GRAPHQL

import Action exposing (Msg(..))
import Gqllib.Object
import Gqllib.Object.Item as Item
import Gqllib.Object.ItemSupply as ItemSupply
import Gqllib.Object.Price as Price
import Gqllib.Query as Query
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet, hardcoded, with)
import Html exposing (Html)
import Json.Decode exposing (..)
import Maybe exposing (Maybe, withDefault)
import State exposing (Item, ItemSupply, Price, Route)


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


itemPriceQuery : Float -> Int -> SelectionSet (Maybe Price) RootQuery
itemPriceQuery id amount =
    Query.items_price { itemId = id, amount = amount } itemPrice


itemPrice : SelectionSet Price Gqllib.Object.Price
itemPrice =
    SelectionSet.map2 Price
        Price.perUnit
        Price.total
