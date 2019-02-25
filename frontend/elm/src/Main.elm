module Main exposing (Model, Msg(..), initialModel, main, update, view)

import Browser
import Color exposing (Color)
import Html
import Html.Attributes as Attr
import Html.Events as Evt exposing (onClick)
import Page.Buy as Buy exposing (..)


type alias Model =
    { color1 : Color
    , color2 : Color
    , route: Route
    }


initialModel : Model
initialModel =
    { color1 = Color.rgb 50 200 100
    , color2 = Color.rgb 0 0 0
    , route = HOME
    }


type Route = HOME | COLOR

type Msg
    = UpdateColor1 Color
    | UpdateColor2 Color
    | SelectedRoute Route


update : Msg -> Model -> Model
update msg model =
    case msg of
        UpdateColor1 newColor1 ->
            { model | color1 = newColor1 }

        UpdateColor2 newColor2 ->
            { model | color2 = newColor2 }

        SelectedRoute newRoute ->
            {model | route = newRoute}


renderPage: Model -> Html.Html Msg
renderPage model =
   case model.route of
   HOME ->
        Html.div[][Html.text "home"]
   COLOR ->
            Html.div[] [
                Html.h1 [ Attr.style "color" (toColorCss model.color1) ] [ Html.text "Title 1" ]
               , Buy.colorPicker model.color1 UpdateColor1
               , Html.hr [] []
               , Html.h1 [ Attr.style "color" (toColorCss model.color2) ] [ Html.text "Title 2" ]
               , Buy.colorPicker model.color2 UpdateColor2
               ]


view : Model -> Html.Html Msg
view model =
    Html.div []
        [
         Html.div[] [
            Html.button[onClick (SelectedRoute COLOR)][
                Html.text "COLOR PICKER"
            ],
            Html.button[onClick (SelectedRoute HOME)] [
                Html.text "HOME"
            ]
         ]
         ,
         renderPage model

        ]


main : Program () Model Msg
main =
    Browser.sandbox
        { init = initialModel
        , view = view
        , update = update
        }

