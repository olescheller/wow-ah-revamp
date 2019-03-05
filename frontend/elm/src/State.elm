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

type alias Item = {
    name : String,
    id: String,
    icon: Maybe String
    }

type alias ItemSupply = {
    id : Float,
    item: Item,
    quantity: Float,
    min_price: Float
    }

type alias DataState = {
      item: Item,
      itemSupplies: Maybe (List (Maybe ItemSupply))
      }

type alias State =
    {
        ui: UiState,
        data: DataState
    }