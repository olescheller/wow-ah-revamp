module Page.Buy exposing (buyList)

import Action exposing (Msg(..))
import Color exposing (Color)
import Html
import Html.Attributes as Attr exposing (..)
import Html.Events as Evt exposing (keyCode, on, onClick, onInput)
import List exposing (..)
import Maybe exposing (Maybe(..), withDefault)
import State exposing (..)


renderItem : State -> Maybe ItemSupply -> Html.Html Msg
renderItem model supply =
    case supply of
        Nothing ->
            Html.tr [] []

        Just val ->
            Html.tr []
                [ Html.td [] [ Html.img [ src ("https://s3.eu-central-1.amazonaws.com/wow-icons/icons/" ++ withDefault "inv_misc_questionmark" val.item.icon ++ ".jpg") ] [] ]
                , Html.td [] [ Html.text <| val.item.name ]
                , Html.td [] [ Html.text <| String.fromFloat val.quantity ]
                , Html.td [] [ Html.text <| String.fromFloat val.min_price ]
                , Html.td [] [ Html.input [ onInput (EnterQuantity val.item.id) ] [] ]
                , Html.td [] [ Html.text (String.fromFloat (getItemPriceMappings val.item.id model).total ++ ", " ++ String.fromFloat (getItemPriceMappings val.item.id model).perUnit) ]
                , Html.td []
                    [ Html.button
                        [ class "col s2 waves-effect waves-light btn #ffd600 yellow accent-4 black-text text-darken-2"
                        , onClick
                            (BuyItem "Elandura-Silvermoon"
                                (withDefault 0 (String.toInt val.item.id))
                                (getItemAmountMappings val.item.id model)
                                (getItemPriceMappings val.item.id model).perUnit
                                (getItemPriceMappings val.item.id model).total
                            )
                        ]
                        [ Html.text "Buy" ]
                    ]
                ]


renderItems : State -> List (Maybe ItemSupply) -> Html.Html Msg
renderItems model items =
    let
        supplyItems =
            List.map (renderItem model) items
    in
    Html.table [ class "stripped" ]
        [ Html.thead []
            [ Html.tr []
                [ Html.th [] []
                , Html.th [] [ Html.text "Name" ]
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


buyList : State -> Maybe (List (Maybe ItemSupply)) -> Html.Html Msg
buyList model items =
    Html.div []
        [ renderItems model (Maybe.withDefault [ Nothing ] items)
        ]
