module Page.Buy exposing (buyList)

import Color exposing (Color)
import Html
import Html.Attributes as Attr
import Html.Events as Evt
import List exposing (..)
import State exposing (..)
import Maybe exposing (Maybe(..))



renderItem : Maybe ItemSupply -> Html.Html msg
renderItem supply =
    case supply of
        Nothing -> Html.li [][]
        Just val ->
              Html.li [] [ Html.text <| val.item.name
              ++ ("#" ++ (String.fromFloat val.quantity)) ]

renderItems : List (Maybe ItemSupply) -> Html.Html msg
renderItems items =
  let
    supplyItems = List.map renderItem items
  in
    Html.ul [] supplyItems


buyList: Maybe (List (Maybe ItemSupply)) -> Html.Html msg
buyList items = Html.div[][
               renderItems (Maybe.withDefault [Nothing] items)
            ]
