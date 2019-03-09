module Page.SellOrders exposing (renderItem, renderItems, sellOrderList)

import Action exposing (Msg(..))
import Html
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick, onInput)
import Lib.StringHelper exposing (getItemIconUrl)
import Maybe exposing (withDefault)
import Page.Buy exposing (moneyString)
import State exposing (SellOrder, State)


renderItem : State -> Maybe SellOrder -> Html.Html Msg
renderItem model sellOrder =
    case sellOrder of
        Nothing ->
            Html.tr [] []

        Just val ->
            Html.tr []
                [ Html.td [] [ Html.img [ class "ui image circular", src (getItemIconUrl val.item) ] [] ]
                , Html.td [] [ Html.text <| val.item.name ]
                , Html.td [] [ Html.text <| String.fromInt val.quantity ]
                , Html.td [] [ moneyString val.price ]
                , Html.td []
                    [ Html.button
                        [ class "col s2 waves-effect waves-light btn #ffd600 red accent-4 white-text text-darken-2"
                        , onClick
                            (DeleteSellOrder val.item.id)
                        ]
                        [ Html.text "Delete" ]
                    ]
                ]


renderItems : State -> Html.Html Msg
renderItems model =
    let
        supplyItems =
            List.map (renderItem model) model.sellOrders
    in
    Html.table [ class "stripped" ]
        [ Html.thead []
            [ Html.tr []
                [ Html.th [] []
                , Html.th [] [ Html.text "Name" ]
                , Html.th [] [ Html.text "Quantity" ]
                , Html.th [] [ Html.text "Price" ]
                , Html.th [] []
                ]
            ]
        , Html.tbody []
            supplyItems
        ]


sellOrderList : State -> Html.Html Msg
sellOrderList model =
    Html.div [ class "container" ]
        [ Html.div [ class "card-panel" ]
            [ Html.h1 [] [ Html.text "Item supplies" ]
            , Html.div []
                [ renderItems model
                ]
            ]
        ]
