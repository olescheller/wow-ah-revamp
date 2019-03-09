module Lib.Button exposing (createAnimatedButton, createAnimatedButtonLight)

import Action exposing (Msg)
import Html
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)


createAnimatedButton : String -> String -> String -> Msg -> Html.Html Msg
createAnimatedButton value icon color callBack =
    Html.div
        [ class ("ui inverted vertical animated button " ++ color)
        , onClick callBack
        ]
        [ Html.div [ class "hidden content" ]
            [ Html.text value
            ]
        , Html.div [ class "visible content" ]
            [ Html.i [ class icon ] []
            ]
        ]


createAnimatedButtonLight : String -> String -> String -> Msg -> Html.Html Msg
createAnimatedButtonLight value icon color callBack =
    Html.div
        [ class ("ui vertical animated button " ++ color)
        , onClick callBack
        ]
        [ Html.div [ class "hidden content" ]
            [ Html.text value
            ]
        , Html.div [ class "visible content" ]
            [ Html.i [ class icon ] []
            ]
        ]
