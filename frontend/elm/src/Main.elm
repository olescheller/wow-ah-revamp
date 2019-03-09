port module Main exposing (createSubscriptions, initialModel, main, update, view)

import Action exposing (Msg(..))
import Browser
import Debug exposing (log)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events as Evt exposing (keyCode, on, onClick, onInput)
import Json.Decode as Json
import Json.Encode as E
import Maybe exposing (..)
import Mutations exposing (buyMutation, deleteSellOrderMutation, makeMutation, sellMutation)
import Page.Buy as Buy exposing (..)
import Page.Sell exposing (displayInventory, displayItemDetail)
import Page.SellOrders exposing (sellOrderList)
import Queries exposing (itemPriceQuery, itemQuery, itemSupplyQuery, itemsSupplyQuery, makeRequest, randomItemsQuery, sellOrderQuery, userQuery)
import State exposing (DataState, FakeItem, Item, ItemSupply, Price, Route(..), SellOrder, State, UiState)
import String exposing (..)


fakeItem : String -> Int -> FakeItem
fakeItem n a =
    { name = n, amount = a }


getUserNameAndRealm model =
    let
        splitUser =
            split "-" model.data.user.name

        name =
            case splitUser of
                [ a, b ] ->
                    a

                _ ->
                    ""

        realm =
            case splitUser of
                [ a, b ] ->
                    b

                _ ->
                    ""
    in
    { name = name, realm = realm }


initialUiState : UiState
initialUiState =
    { route = SELL }


initialItem : Item
initialItem =
    { name = "default"
    , id = "0"
    , icon = Just "none"
    }


initialItemSupplies =
    Maybe.Just [ Nothing ]


initialDataState : DataState
initialDataState =
    { item = initialItem
    , itemSupplies = initialItemSupplies
    , searchValue = ""
    , itemPriceMappings = []
    , itemAmountMappings = []
    , userInventory = []
    , user = { name = "", money = 0 }
    }


initialModel : () -> ( State, Cmd Msg )
initialModel _ =
    ( { ui = initialUiState
      , data = initialDataState
      , sellOrders = []
      , detailItem = Nothing
      , activeDetailItem = Nothing
      }
    , makeRequest (userQuery "Elandura" "Silvermoon") FetchUser
    )


port createSubscriptions : E.Value -> Cmd msg


update : Msg -> State -> ( State, Cmd Msg )
update msg model =
    case msg of
        RequestItemDetail itemName ->
            ( model
            , makeRequest (itemSupplyQuery itemName) SetItemDetail
            )

        SetItemDetail item ->
            case item of
                Ok value ->
                    case value of
                        Just i ->
                            ( { model | detailItem = Just i }, Cmd.none )

                        Nothing ->
                            ( { model | detailItem = Nothing }, Cmd.none )

                Err err ->
                    ( model, Cmd.none )

        GetInitialInventory response ->
            case response of
                Ok value ->
                    let
                        oldData =
                            model.data

                        newData =
                            { oldData | userInventory = value }

                        splitUser =
                            split "-" model.data.user.name

                        name =
                            case splitUser of
                                [ a, b ] ->
                                    a

                                _ ->
                                    ""

                        realm =
                            case splitUser of
                                [ a, b ] ->
                                    b

                                _ ->
                                    ""
                    in
                    ( { model | data = newData }, makeRequest (sellOrderQuery name realm) GotInitialSellOrders )

                Err value ->
                    ( model, Cmd.none )

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
            ( model, makeRequest (itemsSupplyQuery searchValue) GotItemSupplyResponse )

        EnterQuantity itemId quantity ->
            let
                itemAmountMapping =
                    { itemId = itemId, amount = quantity }

                oldData =
                    model.data

                oldItemAmountMappings =
                    oldData.itemAmountMappings

                newItemAmountMappings =
                    itemAmountMapping :: List.filter (\i -> i.itemId /= itemId) oldItemAmountMappings

                newData =
                    { oldData | itemAmountMappings = newItemAmountMappings }
            in
            ( { model | data = newData }, makeRequest (itemPriceQuery (withDefault 0 (String.toFloat itemId)) (withDefault 0 (String.toInt quantity))) (GotItemPriceResponse itemId) )

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

        BuyItem userName itemId amount total perUnit ->
            let
                oldData =
                    model.data

                oldItemAmountMappings =
                    oldData.itemAmountMappings

                oldItemPriceMappings =
                    oldData.itemPriceMappings

                newItemPriceMappings =
                    List.filter (\i -> i.itemId /= String.fromInt itemId) oldItemPriceMappings

                newItemAmountMappings =
                    List.filter (\i -> i.itemId /= String.fromInt itemId) oldItemAmountMappings

                newData =
                    { oldData | itemAmountMappings = newItemAmountMappings, itemPriceMappings = newItemPriceMappings }
            in
            ( { model | data = newData }, makeMutation (buyMutation userName itemId amount total perUnit) GotBuyItemResponse )

        GotBuyItemResponse response ->
            case response of
                Ok value ->
                    let
                        searchValue =
                            model.data.searchValue
                    in
                    ( model, makeRequest (itemsSupplyQuery searchValue) GotItemSupplyResponse )

                Err error ->
                    ( model, Cmd.none )

        FetchUser response ->
            case response of
                Ok value ->
                    case value of
                        Just val ->
                            let
                                oldData =
                                    model.data

                                newData =
                                    { oldData | user = val }
                            in
                            ( { model | data = newData }, makeRequest randomItemsQuery GetInitialInventory )

                        Nothing ->
                            ( model, Cmd.none )

                Err error ->
                    ( model, Cmd.none )

        GotInitialSellOrders response ->
            case response of
                Ok value ->
                    case value of
                        Just val ->
                            ( { model | sellOrders = val }, Cmd.none )

                        Nothing ->
                            ( model, Cmd.none )

                Err error ->
                    ( model, Cmd.none )

        DeleteSellOrder itemId ->
            let
                splitUser =
                    split "-" model.data.user.name

                name =
                    case splitUser of
                        [ a, b ] ->
                            a

                        _ ->
                            ""

                realm =
                    case splitUser of
                        [ a, b ] ->
                            b

                        _ ->
                            ""
            in
            ( model, makeMutation (deleteSellOrderMutation (withDefault 0 (String.toInt itemId)) name realm) GotDeleteSellOrderResponse )

        GotDeleteSellOrderResponse response ->
            let
                splitUser =
                    split "-" model.data.user.name

                name =
                    case splitUser of
                        [ a, b ] ->
                            a

                        _ ->
                            ""

                realm =
                    case splitUser of
                        [ a, b ] ->
                            b

                        _ ->
                            ""
            in
            ( model, makeRequest (sellOrderQuery name realm) GotInitialSellOrders )

        SellItem ->
            case model.activeDetailItem of
                Just value ->
                    let
                        name =
                            (getUserNameAndRealm model).name

                        realm =
                            (getUserNameAndRealm model).realm
                    in
                    ( model, makeMutation (sellMutation (withDefault 0 (String.toInt value.item.id)) name realm value.quantity value.price) SoldItem )

                Nothing ->
                    ( model, Cmd.none )

        EnterSellQuantity quantity ->
            case model.detailItem of
                Just value ->
                    let
                        price =
                            case model.activeDetailItem of
                                Just val ->
                                    val.price

                                Nothing ->
                                    0

                        newActiveDetailItem =
                            { item = value.item, quantity = withDefault 0 (String.toInt quantity), price = price }
                    in
                    ( { model | activeDetailItem = Just newActiveDetailItem }, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        EnterSellPrice price ->
            case model.detailItem of
                Just value ->
                    let
                        quantity =
                            case model.activeDetailItem of
                                Just val ->
                                    val.quantity

                                Nothing ->
                                    0

                        newActiveDetailItem =
                            { item = value.item, quantity = quantity, price = withDefault 0 (String.toFloat price) }
                    in
                    ( { model | activeDetailItem = Just newActiveDetailItem }, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        SoldItem response ->
            ( model, Cmd.none )


getActiveClass : Route -> Route -> String
getActiveClass activeRoute route =
    if activeRoute == route then
        "item active"

    else
        "item "


renderNav : State -> Html.Html Msg
renderNav model =
    Html.div []
        [ Html.div [ class "ui inverted left floated header" ] [ Html.text "wow-ah-revamp" ]
        , Html.div [ class "ui inverted right secondary floated menu" ]
            [ Html.span [ class "item" ] [ Html.text model.data.user.name ]
            , Html.span [ class "item" ] [ moneyString model.data.user.money ]
            , Html.a [ class (getActiveClass model.ui.route BUY), onClick (SetCurrentRoute BUY) ] [ Html.text "Buy" ]
            , Html.a [ class (getActiveClass model.ui.route SELL), onClick (SetCurrentRoute SELL) ] [ Html.text "Sell" ]
            ]
        ]


renderPage : State -> Html.Html Msg
renderPage model =
    case model.ui.route of
        SELL ->
            Html.div [ class "container" ]
                [ Html.h1 [ class "ui inverted header" ] [ Html.text "Inventory" ]
                , Html.div [ class "centered ui grid" ]
                    [ Html.div [ class "seven wide column" ] [ displayInventory model ]
                    , Html.div [ class "nine wide column" ] [ displayItemDetail model ]
                    ]
                , Html.div [ class "ui clearing divider" ] []
                , sellOrderList model
                ]

        BUY ->
            Html.div [ class "container" ] [ Buy.buyPage model ]


view : State -> Html.Html Msg
view model =
    Html.div [ class "ui inverted segment mainContainer" ]
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
