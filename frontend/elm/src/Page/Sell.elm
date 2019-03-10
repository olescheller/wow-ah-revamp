module Page.Sell exposing (displayInventory, displayInventorySlot, displayItem, displayItemDetail)

import Action exposing (Msg(..))
import Html exposing (Html, a, br, div, h1, img, span, text)
import Html.Attributes exposing (class, placeholder, src)
import Html.Events exposing (onClick, onInput, onMouseEnter)
import Lib.Button exposing (createAnimatedButton, createAnimatedButtonLight)
import Lib.StringHelper exposing (getItemIconUrl)
import Maybe exposing (Maybe, withDefault)
import Page.Buy exposing (moneyString)
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
    div [ class "inventoryItem link", onClick (RequestItemDetail item) ]
        [ div [ class "ui tiny image circular" ] [ img [ src <| getItemIconUrl item ] [] ]
        ]


displayItemDetail : State -> Html Msg
displayItemDetail model =
    case model.detailItem of
        Nothing ->
            div [] []

        Just value ->
            div [ class "ui inverted segment" ]
                [ div [ class "ui inverted card" ]
                    [ div [ class "content" ]
                        [ img [ class "right floated mini ui image circular image", src (getItemIconUrl value.item) ] []
                        , div [ class "header" ]
                            [ Html.text value.item.name ]
                        , div [ class "meta" ] [ Html.text "Add info" ]
                        , div [ class "description" ]
                            [ Html.text "Current min buyout:"
                            , moneyString value.min_price
                            ]
                        ]
                    , div [ class "extra content" ]
                        [ moneyString
                            (let
                                price =
                                    case
                                        model.activeDetailItem
                                    of
                                        Just val ->
                                            val.price

                                        Nothing ->
                                            0
                             in
                             price
                            )
                        , Html.div [ class "ui action input " ]
                            [ Html.input [ onInput EnterSellPrice, class "small", placeholder "Price in copper" ] []
                            , Html.input [ class "tiny", placeholder "Amount" ] []
                            , createAnimatedButtonLight "Sell" "right arrow icon" "green" SellItem
                            ]
                        ]
                    ]
                ]
