module State exposing (DataState, FakeItem, InventorySlot, Item, ItemAmountMapping, ItemPriceMapping, ItemSupply, Price, Receipt, Route(..), State, UiState, User, getItemAmountMappings, getItemPriceMappings)

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


type alias Receipt =
    { buyer : Maybe String
    , item : Item
    , amount : Maybe Int
    , amountBought : Maybe Int
    , price : Maybe Int
    , min_price : Maybe Float
    , money : Maybe Float
    }


type alias Price =
    { total : Float, perUnit : Float }


type alias Item =
    { name : String
    , id : String
    , icon : Maybe String
    }


type alias User =
    { name : String
    , money : Float
    }


getItemAmountMappings : String -> State -> String
getItemAmountMappings itemId model =
    (withDefault { itemId = "0", amount = "0" } (List.head (List.filter (\item -> item.itemId == itemId) model.data.itemAmountMappings))).amount


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


type alias ItemAmountMapping =
    { itemId : String
    , amount : String
    }


type alias DataState =
    { item : Item
    , itemSupplies : Maybe (List (Maybe ItemSupply))
    , searchValue : String
    , itemPriceMappings : List ItemPriceMapping
    , itemAmountMappings : List ItemAmountMapping
    , userInventory : List InventorySlot
    , user : User
    }


type alias State =
    { ui : UiState
    , data : DataState
    }



-- User inventory


type alias InventorySlot =
    { item : Item
    , quantity : Int
    }
