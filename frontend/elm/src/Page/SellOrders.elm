module Page.SellOrders exposing (renderItem, renderItems, sellOrderList)

import Action exposing (Msg(..))
import Html
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick, onInput)
import Lib.Button exposing (createAnimatedButton)
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
                    [ createAnimatedButton "Delete" "trash icon" "red" (DeleteSellOrder val) ]
                ]


renderItems : State -> Html.Html Msg
renderItems model =
    let
        supplyItems =
            List.map (renderItem model) model.sellOrders
    in
    Html.table [ class "ui inverted table" ]
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
    Html.div []
        [ Html.div [ class "card-panel" ]
            [ Html.h1 [ class "ui inverted header" ] [ Html.text "My sell orders" ]
            , Html.div []
                [ renderItems model
                ]
            ]
        ]
