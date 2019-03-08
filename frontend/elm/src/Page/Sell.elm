module Page.Sell exposing (..)


import Action exposing (Msg(..))
import Html exposing (Html, br, div, img, span, text)
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick)
import Lib.StringHelper exposing (getItemIconUrl)
import Maybe exposing (withDefault)
import State exposing (InventorySlot, Item, State)


displayInventory : State -> Html Msg
displayInventory model =
    div [class "ui grid"]
    [
    div [](List.map displayInventorySlot model.data.userInventory)
    ,div [][text model.detailItem.item.name]
    ]

displayInventorySlot : Maybe InventorySlot -> Html Msg
displayInventorySlot inventorySlot =
    case inventorySlot of
        Just value ->
            div[][displayItem value.item value.quantity]
        Nothing ->
            div[][]


displayItem : Item -> Int -> Html Msg
displayItem item quantity =
    div[onClick (RequestItemDetail item.name) ][
        img[ src <| getItemIconUrl item ][]
        , span[][text item.name]
        , span[][text (String.fromInt quantity)]
    ]


