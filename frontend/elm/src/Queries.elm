module Queries exposing (..)

-- GRAPHQL
import Action exposing (Msg(..))
import Gqllib.Object
import Gqllib.Object.Item as Item
import Gqllib.Query as Query
import Graphql.Http
import Graphql.Operation exposing (RootQuery)
import Graphql.SelectionSet as SelectionSet exposing (SelectionSet, with)
import State exposing (Item, Route)


makeRequest : Cmd Msg

makeRequest =
    query
        |> Graphql.Http.queryRequest "http://localhost:4000/"
        |> Graphql.Http.send
            (Graphql.Http.discardParsedErrorData
                >> GotResponse
            )


query : SelectionSet (Maybe Item) RootQuery
query =
    Query.item { id = 25 } item

item : SelectionSet Item Gqllib.Object.Item
item =
    SelectionSet.succeed Item
        |> with Item.name