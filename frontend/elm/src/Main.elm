module App exposing (initialModel, main, update, view)

import Action exposing (Msg(..))
import Browser
import Html
import Html.Events as Evt exposing (onClick)
import Page.Buy as Buy exposing (..)
import Maybe exposing (..)
import State exposing(State, FakeItem, Route(..), UiState, DataState, Item)
import String exposing (..)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet, with)
import Gqllib.Object.Item as Item
import Gqllib.Object
import Graphql.Operation exposing (RootQuery)
import Gqllib.Query as Query
import Graphql.Http
import Queries exposing (makeRequest)

fakeItem: String -> Int -> FakeItem
fakeItem n a = {name= n, amount= a}

initialUiState: UiState
initialUiState = {route = SELL}
initialDataState: DataState
initialDataState = {
    name = "default"}

initialModel: Int -> (State, Cmd Msg)
initialModel a = ({
                ui = initialUiState,
                data = initialDataState
                },
                makeRequest)


update : Msg -> State -> (State, Cmd Msg)
update msg model =
    case msg of
        SelectedRoute newRoute ->
            ({model | ui = {route = newRoute}}, Cmd.none)
        GotResponse response ->
            case response of
                Ok value -> ({model | data = (withDefault initialDataState value)}, Cmd.none)
                Err value -> (model, Cmd.none)



renderPage: State -> Html.Html Msg
renderPage model =
   case model.ui.route of
   SELL ->
        Html.div[][Html.text "home"]
   BUY ->   Html.div[][
                Html.text  model.data.name
               ]
            --Html.div[] [
              --  Html.h1 [ Attr.style "color" "green" ] [ Html.text "Item supplies" ]
              -- , Buy.buyList model.data.items
              -- ]


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