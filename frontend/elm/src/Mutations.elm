module Mutations exposing (buyMutation, makeMutation, receipt)

import Gqllib.Mutation as Mutation exposing (BuyItemsOptionalArguments, BuyItemsRequiredArguments, RemoveSellOrderRequiredArguments)
import Gqllib.Object
import Gqllib.Object.Receipt as Receipt
import Graphql.Http
import Graphql.Operation exposing (RootMutation)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet)
import Queries exposing (item)
import State exposing (Item, Receipt)


makeMutation mutation message =
    mutation
        |> Graphql.Http.mutationRequest "http://localhost:4000/"
        |> Graphql.Http.send
            (Graphql.Http.discardParsedErrorData
                >> message
            )


buyMutation : String -> Int -> Int -> Float -> Float -> SelectionSet (Maybe Receipt) RootMutation
buyMutation userName itemId amount total perUnit =
    Mutation.buyItems (\oi -> BuyItemsOptionalArguments (Present itemId)) (BuyItemsRequiredArguments userName amount total perUnit) receipt


receipt : SelectionSet Receipt Gqllib.Object.Receipt
receipt =
    SelectionSet.map7 Receipt
        Receipt.buyer
        (Receipt.item <| item)
        Receipt.amount
        Receipt.amountBought
        Receipt.price
        Receipt.min_price
        Receipt.money


deleteSellOrderMutation : Int -> String -> String -> SelectionSet Bool RootMutation
deleteSellOrderMutation itemId seller_name seller_realm =
    Mutation.removeSellOrder (RemoveSellOrderRequiredArguments itemId seller_name seller_realm)
