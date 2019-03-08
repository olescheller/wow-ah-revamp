module Page.Sell exposing (..)


import Action exposing (Msg(..))
import Html exposing (Html, div, img, span, text)
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick)
import Maybe exposing (withDefault)
import State exposing (InventorySlot, Item, State)


displayInventory : State -> Html Msg
displayInventory model =
    div [class "ui grid"]
    [
    div [](List.map displayInventorySlot model.data.userInventory)
    ,div [][text model.detailItem]
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
    div[onClick (SetItemDetail item.id) ][
        img[ src ("https://s3.eu-central-1.amazonaws.com/wow-icons/icons/" ++ withDefault "inv_misc_questionmark" item.icon ++ ".jpg")][]
        , span[][text item.name]
        , span[][text (String.fromInt quantity)]
    ]

