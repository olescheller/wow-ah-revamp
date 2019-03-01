module State exposing (..)


type Route = SELL | BUY


type alias UiState =
    {
    route: Route
    }

type alias Item =
    {name: String,
    amount: Int
    }

type alias DataState =
    { items : List Item }

type alias State =
    {
        ui: UiState,
        data: DataState
    }