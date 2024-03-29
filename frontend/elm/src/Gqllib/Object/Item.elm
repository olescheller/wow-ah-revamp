-- Do not manually edit this file, it was auto-generated by dillonkearns/elm-graphql
-- https://github.com/dillonkearns/elm-graphql


module Gqllib.Object.Item exposing (icon, id, is_stackable, item_class, item_sub_class, name)

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
name : SelectionSet String Gqllib.Object.Item
name =
    Object.selectionForField "String" "name" [] Decode.string


{-| -}
id : SelectionSet String Gqllib.Object.Item
id =
    Object.selectionForField "String" "id" [] Decode.string


{-| -}
icon : SelectionSet (Maybe String) Gqllib.Object.Item
icon =
    Object.selectionForField "(Maybe String)" "icon" [] (Decode.string |> Decode.nullable)


{-| -}
is_stackable : SelectionSet Bool Gqllib.Object.Item
is_stackable =
    Object.selectionForField "Bool" "is_stackable" [] Decode.bool


{-| -}
item_class : SelectionSet decodesTo Gqllib.Object.ItemClass -> SelectionSet decodesTo Gqllib.Object.Item
item_class object_ =
    Object.selectionForCompositeField "item_class" [] object_ identity


{-| -}
item_sub_class : SelectionSet decodesTo Gqllib.Object.SubClass -> SelectionSet decodesTo Gqllib.Object.Item
item_sub_class object_ =
    Object.selectionForCompositeField "item_sub_class" [] object_ identity
