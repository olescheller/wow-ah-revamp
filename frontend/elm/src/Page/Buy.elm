module Page.Buy exposing (buyList)

import Color exposing (Color)
import Html
import Html.Attributes as Attr
import Html.Events as Evt
import List exposing (..)
import State exposing (..)
import Maybe exposing (Maybe(..))



renderItem : FakeItem -> Html.Html msg
renderItem item =
  Html.li [] [ Html.text <|  (String.fromInt item.amount) ++ ("#" ++ item.name) ]

renderItems : List FakeItem -> Html.Html msg
renderItems items =
  let
    supplyItems = List.map renderItem items
  in
    Html.ul [] supplyItems


buyList: List FakeItem -> Html.Html msg
buyList items = Html.div[][
               renderItems items
            ]
