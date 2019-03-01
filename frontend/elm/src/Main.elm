module App exposing (Msg(..), initialModel, main, update, view)

import Browser
import Color exposing (Color)
import Html
import Html.Attributes as Attr
import Html.Events as Evt exposing (onClick)
import Page.Buy as Buy exposing (..)
import List exposing (..)
import Maybe exposing (Maybe(..))
import Http
import State exposing(State, Item, Route(..), UiState, DataState)
import String exposing (..)
import Json.Decode exposing (list, string)


item: String -> Int -> Item
item n a = {name= n, amount= a}

initialUiState: UiState
initialUiState = {route = SELL}
initialDataState: DataState
initialDataState = {items = [(item "wool" 1), (item "linen" 3), (item "steel" 2)]}


initialModel: Int -> (State, Cmd Msg)
initialModel seed = ({
                ui = initialUiState,
                data = initialDataState
                },
                Cmd.none)

type Msg
    = SelectedRoute Route


update : Msg -> State -> (State, Cmd Msg)
update msg model =
    case msg of
        SelectedRoute newRoute ->
            ({model | ui = {route = newRoute}}, Cmd.none)


renderPage: State -> Html.Html Msg
renderPage model =
   case model.ui.route of
   SELL ->
        Html.div[][Html.text "home"]
   BUY ->
            Html.div[] [
                Html.h1 [ Attr.style "color" "green" ] [ Html.text "Item supplies" ]
               , Buy.buyList model.data.items
               ]


view : State -> Html.Html Msg
view model =
    Html.div []
        [
         Html.div[] [
            Html.button[onClick (SelectedRoute BUY)][
                Html.text "BUY"
            ],
            Html.button[onClick (SelectedRoute SELL)] [
                Html.text "SELL"
            ]
         ]
         ,
         renderPage model

        ]


subscriptions _ = Sub.none

main = Browser.element {
        init = initialModel,
        update = update,
        view = view,
        subscriptions = subscriptions
        }