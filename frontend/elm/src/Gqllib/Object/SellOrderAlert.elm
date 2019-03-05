-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Gqllib.Object.SellOrderAlert exposing (amount, buyerName, itemName, money, sellerName)

import Gqllib.InputObject
import Gqllib.Interface
import Gqllib.Object
import Gqllib.Scalar
import Gqllib.ScalarCodecs
import Gqllib.Union
import Graphql.Internal.Builder.Argument as Argument exposing (Argument)
import Graphql.Internal.Builder.Object as Object
import Graphql.Internal.Encode as Encode exposing (Value)
import Graphql.Operation exposing (RootMutation, RootQuery, RootSubscription)
import Graphql.OptionalArgument exposing (OptionalArgument(..))
import Graphql.SelectionSet exposing (SelectionSet)
import Json.Decode as Decode


{-| -}
sellerName : SelectionSet String Gqllib.Object.SellOrderAlert
sellerName =
    Object.selectionForField "String" "sellerName" [] Decode.string


{-| -}
buyerName : SelectionSet String Gqllib.Object.SellOrderAlert
buyerName =
    Object.selectionForField "String" "buyerName" [] Decode.string


{-| -}
itemName : SelectionSet String Gqllib.Object.SellOrderAlert
itemName =
    Object.selectionForField "String" "itemName" [] Decode.string


{-| -}
amount : SelectionSet Int Gqllib.Object.SellOrderAlert
amount =
    Object.selectionForField "Int" "amount" [] Decode.int


{-| -}
money : SelectionSet Float Gqllib.Object.SellOrderAlert
money =
    Object.selectionForField "Float" "money" [] Decode.float