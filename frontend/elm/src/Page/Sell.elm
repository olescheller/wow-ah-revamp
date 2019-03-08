module Page.Sell exposing (..)


import Action exposing (Msg(..))
import Html exposing (Html, a, br, div, h1, img, span, text)
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick)
import Lib.StringHelper exposing (getItemIconUrl)
import Maybe exposing (withDefault)
import State exposing (InventorySlot, Item, ItemSupply, State)


displayInventory : State -> Html Msg
displayInventory model =
    div[][
    h1[] [text "Sell items"]
    , div [class "ui grid"]
    [
    div [class "ui items "](List.map displayInventorySlot model.data.userInventory)
    ,div [][text model.detailItem.item.name]
    ]
    ]
displayInventorySlot : Maybe InventorySlot -> Html Msg
displayInventorySlot inventorySlot =
    case inventorySlot of
        Just value ->
            displayItem value.item value.quantity
        Nothing ->
            div[][]


displayItem : Item -> Int -> Html Msg
displayItem item quantity =
    div[ class "item", onClick (RequestItemDetail item.name) ][
        div[ class "ui tiny image circular" ][ img[ src <| getItemIconUrl item ][] ]
        , div[ class "content"][
            a [ class "header"][text item.name]
            , div [class "description"][
                span[][text ("Owned quantity: " ++ (String.fromInt quantity))]
            ]
        ]

    ]

displayItemDetail : ItemSupply -> Html Msg
displayItemDetail itemSupply =
    div [][
        div [][
        ]
        , div [][]
    ]


