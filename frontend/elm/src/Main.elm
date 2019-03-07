module App exposing (initialModel, main, update, view)

import Action exposing (Msg(..))
import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events as Evt exposing (keyCode, on, onClick, onInput)
import Json.Decode as Json
import Maybe exposing (..)
import Page.Buy as Buy exposing (..)
import Queries exposing (itemPriceQuery, itemQuery, itemSupplyQuery, makeRequest)
import State exposing (DataState, FakeItem, Item, ItemSupply, Price, Route(..), State, UiState)
import String exposing (..)
import Tuple exposing (first)


fakeItem : String -> Int -> FakeItem
fakeItem n a =
    { name = n, amount = a }


initialUiState : UiState
initialUiState =
    { route = SELL }


initialItem : Item
initialItem =
    { name = "default"
    , id = "0"
    , icon = Just "none"
    }


initialItemPriceMappings =
    []


initialItemSupplies =
    Maybe.Just [ Nothing ]


initialDataState : DataState
initialDataState =
    { item = initialItem
    , itemSupplies = initialItemSupplies
    , searchValue = ""
    , itemPriceMappings = initialItemPriceMappings
    }


initialModel : Int -> ( State, Cmd Msg )
initialModel a =
    ( { ui = initialUiState
      , data = initialDataState
      }
    , Cmd.none
    )


update : Msg -> State -> ( State, Cmd Msg )
update msg model =
    case msg of
        SetCurrentRoute newRoute ->
            ( { model | ui = { route = newRoute } }, Cmd.none )

        GotItemResponse response ->
            case response of
                Ok value ->
                    let
                        oldData =
                            model.data

                        newData =
                            { oldData | item = withDefault initialItem value }
                    in
                    ( { model | data = newData }, Cmd.none )

                Err value ->
                    ( model, Cmd.none )

        GotItemSupplyResponse response ->
            case response of
                Ok value ->
                    let
                        oldData =
                            model.data

                        newData =
                            { oldData | itemSupplies = value }
                    in
                    ( { model | data = newData }, Cmd.none )

                Err value ->
                    ( model, Cmd.none )

        EnterSearchValue value ->
            let
                oldData =
                    model.data

                newData =
                    { oldData | searchValue = value }
            in
            ( { model | data = newData }, Cmd.none )

        SearchItemSupplies ->
            let
                searchValue =
                    model.data.searchValue
            in
            ( model, makeRequest (itemSupplyQuery searchValue) GotItemSupplyResponse )

        EnterQuantity itemId quantity ->
            ( model, makeRequest (itemPriceQuery (withDefault 0 (String.toFloat itemId)) (withDefault 0 (String.toInt quantity))) (GotItemPriceResponse itemId) )

        GotItemPriceResponse itemId response ->
            case response of
                Ok val ->
                    case val of
                        Just value ->
                            let
                                oldData =
                                    model.data

                                oldItemPriceMappings =
                                    oldData.itemPriceMappings

                                --List ItemPriceMapping
                                itemPriceMapping =
                                    { itemId = itemId, price = value }

                                newItemPriceMappings =
                                    itemPriceMapping :: List.filter (\i -> i.itemId /= itemId) oldItemPriceMappings

                                newData =
                                    { oldData | itemPriceMappings = newItemPriceMappings }
                            in
                            ( { model | data = newData }, Cmd.none )

                        Nothing ->
                            ( model, Cmd.none )

                Err value ->
                    ( model, Cmd.none )


getActiveClass : Route -> Route -> String
getActiveClass activeRoute route =
    if activeRoute == route then
        "item yellow active"

    else
        "item  yellow"


renderNav : State -> Html.Html Msg
renderNav model =
    Html.div []
        [ Html.div [ class "ui inverted left floated header" ] [ Html.text "WOW-AH-revamp" ]
        , Html.div [ class "ui inverted right floated secondary pointing menu" ]
            [ Html.a [ class (getActiveClass model.ui.route BUY), onClick (SetCurrentRoute BUY) ] [ Html.text "Buy" ]
            , Html.a [ class (getActiveClass model.ui.route SELL), onClick (SetCurrentRoute SELL) ] [ Html.text "Sell" ]
            ]
        ]


onEnter : Msg -> Attribute Msg
onEnter msg =
    let
        isEnter code =
            if code == 13 then
                Json.succeed msg

            else
                Json.fail "not ENTER"
    in
    on "keydown" (Json.andThen isEnter keyCode)


renderPage : State -> Html.Html Msg
renderPage model =
    case model.ui.route of
        SELL ->
            Html.div [] [ Html.text "home" ]

        BUY ->
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
                        [ Buy.buyList model model.data.itemSupplies
                        ]
                    ]
                ]


view : State -> Html.Html Msg
view model =
    Html.div [ class "ui inverted segment" ]
        [ renderNav model
        , Html.div [ class "ui clearing divider" ] []
        , renderPage model
        ]


subscriptions _ =
    Sub.none


main =
    Browser.element
        { init = initialModel
        , update = update
        , view = view
        , subscriptions = subscriptions
        }
