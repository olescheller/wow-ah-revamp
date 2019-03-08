module Page.Buy exposing (buyList, buyPage, moneyString, renderItem, renderItems)

import Action exposing (Msg(..))
import Html
import Html.Attributes as Attr exposing (..)
import Html.Events as Evt exposing (keyCode, on, onClick, onInput)
import Lib.HtmlEvents exposing (onEnter)
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
                [ Html.td [] [ Html.img [ class "circular", src ("https://s3.eu-central-1.amazonaws.com/wow-icons/icons/" ++ withDefault "inv_misc_questionmark" val.item.icon ++ ".jpg") ] [] ]
                , Html.td [] [ Html.text <| val.item.name ]
                , Html.td [] [ Html.text <| String.fromFloat val.quantity ]
                , Html.td [] [ moneyString val.min_price ]
                , Html.td [] [ Html.input [ onInput (EnterQuantity val.item.id), value (getItemAmountMappings val.item.id model) ] [] ]
                , Html.td []
                    [ moneyString (getItemPriceMappings val.item.id model).total
                    , moneyString (getItemPriceMappings val.item.id model).perUnit
                    ]
                , Html.td []
                    [ Html.button
                        [ class "col s2 waves-effect waves-light btn #ffd600 yellow accent-4 black-text text-darken-2"
                        , onClick
                            (BuyItem "Elandura-Silvermoon"
                                (withDefault 0 (String.toInt val.item.id))
                                (withDefault 0 (String.toInt (getItemAmountMappings val.item.id model)))
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


buyPage : State -> Html.Html Msg
buyPage model =
    Html.div [ class "container" ]
        [ Html.div [ class "card-panel" ]
            [ Html.h1 [] [ Html.text "Item supplies" ]
            , Html.div [ class "row" ]
                [ Html.input
                    [ class "col s10"
                    , placeholder "item name"
                    , value model.data.searchValue
                    , onInput EnterSearchValue
                    , onEnter SearchItemSupplies
                    ]
                    []
                , Html.button
                    [ class "col s2 waves-effect waves-light btn #ffd600 yellow accent-4 black-text text-darken-2"
                    , onClick SearchItemSupplies
                    ]
                    [ Html.text "Search" ]
                ]
            , Html.div []
                [ buyList model model.data.itemSupplies
                ]
            ]
        ]


moneyString : Float -> Html.Html Msg
moneyString money =
    let
        flooredMoney =
            floor money

        gold =
            floor (toFloat flooredMoney / 10000)

        silver =
            floor (toFloat (modBy 10000 flooredMoney) / 100)

        copper =
            modBy 100 (modBy 10000 flooredMoney)
    in
    Html.div []
        [ Html.span []
            [ Html.text (String.fromInt gold ++ " ")
            , Html.img [ src "src/assets/Gold.png" ] []
            , Html.text (String.fromInt silver ++ " ")
            , Html.img [ src "src/assets/Silver.png" ] []
            , Html.text (String.fromInt copper ++ " ")
            , Html.img [ src "src/assets/Copper.png" ] []
            ]
        ]
