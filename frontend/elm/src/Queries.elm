module Queries exposing (..)

-- GRAPHQL
import Action exposing (Msg(..))
import Gqllib.Object
import Gqllib.Object.ItemSupply as ItemSupply
import Gqllib.Object.Item as Item
import Gqllib.Query as Query
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet, with, hardcoded)
import Html exposing (Html)
import Maybe exposing (Maybe, withDefault)
import State exposing (Item, ItemSupply, Route)
import Json.Decode exposing (..)



makeRequest qr a =
    qr
        |> Graphql.Http.queryRequest "http://localhost:4000/"
        |> Graphql.Http.send
            (Graphql.Http.discardParsedErrorData
                >> a
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


itemSupplyQuery : SelectionSet (Maybe (List (Maybe ItemSupply))) RootQuery
itemSupplyQuery =
    Query.items_supply { partialItemName = "wool"} itemSupply

itemSupply : SelectionSet ItemSupply Gqllib.Object.ItemSupply
itemSupply =
       SelectionSet.map4 ItemSupply
                ItemSupply.id
                (ItemSupply.item <| item)
                ItemSupply.quantity
                ItemSupply.min_price


