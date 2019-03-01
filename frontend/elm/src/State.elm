module State exposing (..)

type Route = SELL | BUY


type alias UiState =
    {
    route: Route
    }

type alias FakeItem =
    {name: String,
    amount: Int
    }

type alias Item = { name : String }


type alias DataState =
      Item

type alias State =
    {
        ui: UiState,
        data: DataState
    }