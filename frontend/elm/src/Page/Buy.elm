module Page.Buy exposing (buyList)

import Color exposing (Color)
import Html
import Html.Attributes as Attr exposing (..)
import Html.Events as Evt
import List exposing (..)
import Maybe exposing (Maybe(..))
import State exposing (..)


renderItem : Maybe ItemSupply -> Html.Html msg
renderItem supply =
    case supply of
        Nothing ->
            Html.tr [] []

        Just val ->
            Html.tr []
                [ Html.td [] [ Html.text <| val.item.name ]
                , Html.td [] [ Html.text <| String.fromFloat val.quantity ]
                , Html.td [] [ Html.text <| String.fromFloat val.min_price ]
                , Html.td [] [ Html.input [] [] ]
                , Html.td [] [ Html.text "3000" ]
                , Html.td [] [ Html.button [ class "col s2 waves-effect waves-light btn #ffd600 yellow accent-4 black-text text-darken-2" ] [ Html.text "Buy" ] ]
                ]


renderItems : List (Maybe ItemSupply) -> Html.Html msg
renderItems items =
    let
        supplyItems =
            List.map renderItem items
    in
    Html.table [ class "stripped" ]
        [ Html.thead []
            [ Html.tr []
                [ Html.th [] [ Html.text "Name" ]
                , Html.th [] [ Html.text "Quantity" ]
                , Html.th [] [ Html.text "Min. Price" ]
                , Html.th [] [ Html.text "Buy Quantity" ]
                , Html.th [] [ Html.text "Price total/Price per Unit" ]
                , Html.th [] []
                ]
            ]
        , Html.tbody []
            supplyItems
        ]


buyList : Maybe (List (Maybe ItemSupply)) -> Html.Html msg
buyList items =
    Html.div []
        [ renderItems (Maybe.withDefault [ Nothing ] items)
        ]
