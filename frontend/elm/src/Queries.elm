module Queries exposing (item, itemPriceQuery, itemQuery, itemSupply, itemSupplyQuery, itemsSupplyQuery, makeRequest, randomItemsQuery, sellOrderQuery, userQuery)

-- GRAPHQL

import Action exposing (Msg(..))
import Gqllib.Object exposing (InventoryItem)
import Gqllib.Object.InventoryItem as InventoryItem
import Gqllib.Object.Item as Item
import Gqllib.Object.ItemSupply as ItemSupply
import Gqllib.Object.Price as Price
import Gqllib.Object.SellOrder as SellOrder
import Gqllib.Object.User as User
import Gqllib.Query as Query
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet, hardcoded, with)
import Html exposing (Html)
import Json.Decode exposing (..)
import Lib.Config exposing (graphQlServerUrl)
import Maybe exposing (Maybe, withDefault)
import State exposing (InventorySlot, Item, ItemSupply, Price, Route, SellOrder, User)


makeRequest query message =
    query
        |> Graphql.Http.queryRequest graphQlServerUrl
        |> Graphql.Http.send
            (Graphql.Http.discardParsedErrorData
                >> message
            )


itemQuery : String -> SelectionSet (Maybe Item) RootQuery
itemQuery itemId =
    case String.toFloat itemId of
        Just id ->
            Query.item { id = id } item

        Nothing ->
            Query.item { id = 0 } item


item : SelectionSet Item Gqllib.Object.Item
item =
    SelectionSet.map3 Item
        Item.name
        Item.id
        Item.icon


itemSupplyQuery : String -> SelectionSet (Maybe ItemSupply) RootQuery
itemSupplyQuery itemName =
    Query.item_supply { itemName = itemName } itemSupply


itemsSupplyQuery : String -> SelectionSet (Maybe (List (Maybe ItemSupply))) RootQuery
itemsSupplyQuery searchValue =
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


randomItemsQuery : SelectionSet (List (Maybe InventorySlot)) RootQuery
randomItemsQuery =
    Query.randomItems randomItem


randomItem : SelectionSet InventorySlot Gqllib.Object.InventoryItem
randomItem =
    SelectionSet.map2 InventorySlot
        (InventoryItem.item <| item)
        InventoryItem.quantity


userQuery : String -> String -> SelectionSet (Maybe User) RootQuery
userQuery name realm =
    Query.user { name = name, realm = realm } user


user : SelectionSet User Gqllib.Object.User
user =
    SelectionSet.map2 User
        User.name
        User.money


sellOrderQuery : String -> String -> SelectionSet (Maybe (List (Maybe SellOrder))) RootQuery
sellOrderQuery userName realmName =
    Query.sell_order { userName = userName, realmName = realmName } sellOrder


sellOrder =
    SelectionSet.map3 SellOrder
        (SellOrder.item <| item)
        SellOrder.price
        SellOrder.quantity
