-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Gqllib.Object.InventoryItem exposing (item, quantity)

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
item : SelectionSet decodesTo Gqllib.Object.Item -> SelectionSet decodesTo Gqllib.Object.InventoryItem
item object_ =
    Object.selectionForCompositeField "item" [] object_ identity


{-| -}
quantity : SelectionSet Int Gqllib.Object.InventoryItem
quantity =
    Object.selectionForField "Int" "quantity" [] Decode.int
