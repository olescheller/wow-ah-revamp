module State exposing (DataState, FakeItem, Item, ItemSupply, Price, Route(..), State, UiState, getItemPriceMappings)

import Maybe exposing (withDefault)


type Route
    = SELL
    | BUY


type alias UiState =
    { route : Route
    }


type alias FakeItem =
    { name : String
    , amount : Int
    }


type alias Price =
    { total : Float, perUnit : Float }


type alias Item =
    { name : String
    , id : String
    , icon : Maybe String
    }


getItemPriceMappings : String -> State -> Price
getItemPriceMappings itemId model =
    (withDefault { itemId = "0", price = { total = 0, perUnit = 0 } } (List.head (List.filter (\item -> item.itemId == itemId) model.data.itemPriceMappings))).price


type alias ItemSupply =
    { id : Float
    , item : Item
    , quantity : Float
    , min_price : Float
    }


type alias ItemPriceMapping =
    { itemId : String
    , price : Price
    }


type alias DataState =
    { item : Item
    , itemSupplies : Maybe (List (Maybe ItemSupply))
    , searchValue : String
    , itemPriceMappings : List ItemPriceMapping
    }


type alias State =
    { ui : UiState
    , data : DataState
    }
