module App exposing (initialModel, main, update, view)

import Action exposing (Msg(..))
import Browser
import Html
import Html.Events as Evt exposing (onClick)
import Page.Buy as Buy exposing (..)
import Maybe exposing (..)
import State exposing(State, FakeItem, Route(..), UiState, ItemSupply, DataState, Item)
import String exposing (..)
import Queries exposing (makeRequest, itemQuery, itemSupplyQuery)

fakeItem: String -> Int -> FakeItem
fakeItem n a = {name= n, amount= a}

initialUiState: UiState
initialUiState = {route = SELL}
initialItem: Item
initialItem = {
       name = "default",
       id = "0",
       icon = Just "none"}
initialItemSupplies = Maybe.Just [Nothing]
initialDataState: DataState
initialDataState = {
    item = initialItem,
    itemSupplies = initialItemSupplies
    }

initialModel: Int -> (State, Cmd Msg)
initialModel a = ({
                ui = initialUiState,
                data = initialDataState
                },
                makeRequest itemSupplyQuery GotItemSupplyResponse)


update : Msg -> State -> (State, Cmd Msg)
update msg model =
    case msg of
        SelectedRoute newRoute ->
            ({model | ui = {route = newRoute}}, Cmd.none)
        GotItemResponse response ->
            case response of
                Ok value -> ({model | data =
                    {item = (withDefault initialItem value),
                    itemSupplies = initialItemSupplies}}
                    , Cmd.none)
                Err value -> (model, Cmd.none)
        GotItemSupplyResponse response ->
            case response of
                Ok value ->
                    let
                        oldData = model.data
                        newData = {oldData | itemSupplies = value}
                    in
                    ({model | data = newData}, Cmd.none)

                Err value -> (model, Cmd.none)



renderPage: State -> Html.Html Msg
renderPage model =
   case model.ui.route of
   SELL ->
        Html.div[][Html.text "home"]
   BUY ->   Html.div[][
                Html.text  model.data.item.name
                ,
                 Html.div[] [
                    Html.h1 [] [ Html.text "Item supplies" ]
                   , Buy.buyList model.data.itemSupplies
                   ]
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