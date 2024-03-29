-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Gqllib.Object.Receipt exposing (amount, amountBought, buyer, item, min_price, money, price)

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
buyer : SelectionSet (Maybe String) Gqllib.Object.Receipt
buyer =
    Object.selectionForField "(Maybe String)" "buyer" [] (Decode.string |> Decode.nullable)


{-| -}
item : SelectionSet decodesTo Gqllib.Object.Item -> SelectionSet decodesTo Gqllib.Object.Receipt
item object_ =
    Object.selectionForCompositeField "item" [] object_ identity


{-| -}
amount : SelectionSet (Maybe Int) Gqllib.Object.Receipt
amount =
    Object.selectionForField "(Maybe Int)" "amount" [] (Decode.int |> Decode.nullable)


{-| -}
amountBought : SelectionSet (Maybe Int) Gqllib.Object.Receipt
amountBought =
    Object.selectionForField "(Maybe Int)" "amountBought" [] (Decode.int |> Decode.nullable)


{-| -}
price : SelectionSet (Maybe Int) Gqllib.Object.Receipt
price =
    Object.selectionForField "(Maybe Int)" "price" [] (Decode.int |> Decode.nullable)


{-| -}
min_price : SelectionSet (Maybe Float) Gqllib.Object.Receipt
min_price =
    Object.selectionForField "(Maybe Float)" "min_price" [] (Decode.float |> Decode.nullable)


{-| -}
money : SelectionSet (Maybe Float) Gqllib.Object.Receipt
money =
    Object.selectionForField "(Maybe Float)" "money" [] (Decode.float |> Decode.nullable)
