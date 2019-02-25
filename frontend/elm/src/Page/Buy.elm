module Page.Buy exposing (colorPicker, toColorCss, colorSlider)

import Color exposing (Color)
import Html
import Html.Attributes as Attr
import Html.Events as Evt


colorSlider : String -> Int -> (Int -> msg) -> Html.Html msg
colorSlider name colorValue toMsg =
    Html.div []
        [ Html.p [] [ Html.text name ]
        , Html.input
            [ Attr.type_ "range"
            , Attr.name ("color" ++ name)
            , Attr.min "0"
            , Attr.max "255"
            , Attr.value (String.fromInt colorValue)
            , Evt.onInput (toMsg << toInt colorValue)
            ]
            []
        , Html.span [] [ Html.text (String.fromInt colorValue) ]
        ]


colorPicker : Color -> (Color -> msg) -> Html.Html msg
colorPicker color toMsg =
    let
        { red, green, blue } =
            Color.toRgb color
    in
    Html.div []
        [ colorSlider "Red" red (toMsg << redToColour color)
        , colorSlider "Green" green (toMsg << greenToColour color)
        , colorSlider "Blue" blue (toMsg << blueToColour color)
        , Html.div
            [ Attr.style "border" "1px solid black"
            , Attr.style "width" "100px"
            , Attr.style "height" "100px"
            , Attr.style "background-color" (toColorCss color)
            ]
            []
        ]


toInt : Int -> String -> Int
toInt defaultValue strValue =
    strValue
        |> String.toInt
        |> Maybe.withDefault defaultValue


redToColour : Color -> Int -> Color
redToColour color newRed =
    let
        { red, green, blue } =
            Color.toRgb color
    in
    Color.rgb newRed green blue


greenToColour : Color -> Int -> Color
greenToColour color newGreen =
    let
        { red, green, blue } =
            Color.toRgb color
    in
    Color.rgb red newGreen blue


blueToColour : Color -> Int -> Color
blueToColour color newBlue =
    let
        { red, green, blue } =
            Color.toRgb color
    in
    Color.rgb red green newBlue


toColorCss : Color -> String
toColorCss color =
    let
        { red, green, blue } =
            Color.toRgb color
    in
    "rgb("
        ++ String.fromInt red
        ++ ","
        ++ String.fromInt green
        ++ ","
        ++ String.fromInt blue
        ++ ")"
