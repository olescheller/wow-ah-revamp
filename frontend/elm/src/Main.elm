module Main exposing (Model, Msg(..), initialModel, main, update, view)

import Browser
import Color exposing (Color)
import Html
import Html.Attributes as Attr
import Html.Events as Evt exposing (onClick)
import Page.Buy as Buy exposing (..)
import List exposing (..)
import Maybe exposing (Maybe(..))
import Http
import String exposing (..)
import Json.Decode exposing (list, string)

type alias Model =
    { items : List Item
    , route: Route
    }

type alias Item =
    {name: String,
    amount: Int
    }

item: String -> Int -> Item
item n a = {name= n, amount= a}

initialModel : Model
initialModel =
    { items = [(item "wool" 1), (item "linen" 3), (item "steel" 2)]
    , route = SELL
    }


type Route = SELL | BUY

type Msg
    = SelectedRoute Route |
    GotItemSupplies (Result Http.Error (List String))



update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        SelectedRoute newRoute ->
            ({model | route = newRoute}, Cmd.none)
        GotItemSupplies Result ->
            (model, getItemSupplies)


getItemSupplies : Cmd Msg
getItemSupplies =
    let qry =  "{items_supply(partialItemName:" ++ "\"wool\")" ++ "{ item {id name icon}, min_price quantity}}"

    in
        Http.post
            { url = "http://localhost:4000/"
            , body = Http.stringBody "text/plain" qry
            , expect = Http.expectJson GotItemSupplies (list string)
            }


renderPage: Model -> Html.Html Msg
renderPage model =
   case model.route of
   SELL ->
        Html.div[][Html.text "home"]
   BUY ->
            Html.div[] [
                Html.h1 [ Attr.style "color" "green" ] [ Html.text "Item supplies" ]
               , Buy.buyList model.items
               ]


view : Model -> Html.Html Msg
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


main : Program () Model Msg
main =
    Browser.sandbox
        { init = initialModel
        , view = view
        , update = update
        }

