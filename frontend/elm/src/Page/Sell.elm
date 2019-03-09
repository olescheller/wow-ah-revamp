module Page.Sell exposing (displayInventory, displayInventorySlot, displayItem, displayItemDetail)

import Action exposing (Msg(..))
import Html exposing (Html, a, br, div, h1, img, span, text)
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick, onMouseEnter)
import Lib.StringHelper exposing (getItemIconUrl)
import Maybe exposing (Maybe, withDefault)
import State exposing (InventorySlot, Item, ItemSupply, State)


fillInventory list =
    let
        listLength =
            List.length list

        empty =
            16 - listLength

        emptySlots =
            List.repeat empty Nothing
    in
    List.concat [ list, emptySlots ]


displayInventory : State -> Html Msg
displayInventory model =
    div []
        [ div [ class "inventoryContainer" ]
            [ div [ class "inventoryItemGrid" ] (List.map displayInventorySlot (fillInventory model.data.userInventory))
            ]
        ]


displayInventorySlot : Maybe InventorySlot -> Html Msg
displayInventorySlot inventorySlot =
    case inventorySlot of
        Just value ->
            displayItem value.item value.quantity

        Nothing ->
            div [ class "inventoryItem emptySlot" ] []


displayItem : Item -> Int -> Html Msg
displayItem item quantity =
    div [ class "inventoryItem link", onClick (RequestItemDetail item.name) ]
        [ div [ class "ui tiny image circular" ] [ img [ src <| getItemIconUrl item ] [] ]
        ]


displayItemDetail : Maybe ItemSupply -> Html Msg
displayItemDetail itemSupply =
    case itemSupply of
        Nothing ->
            div [] []

        Just value ->
            div [ class "ui inverted segment" ]
                [ div [ class "ui inverted card" ]
                    [ div [ class "content" ]
                        [ img [ class "right floated mini ui image circular image", src (getItemIconUrl value.item) ] []
                        , div [ class "header" ]
                            [ Html.text value.item.name ]
                        , div [ class "meta" ] [ Html.text (String.fromFloat value.min_price) ]
                        , div [ class "description" ] []
                        ]
                    , div [ class "extra content" ]
                        [ Html.text "Sell"
                        ]
                    ]
                ]
