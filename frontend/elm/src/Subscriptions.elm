module Subscriptions exposing (subscriptionDocument)

import Gqllib.Subscription exposing (ReceiptRequiredArguments, receipt)
import Graphql.Document exposing (serializeSubscription)
import Graphql.Http
import Graphql.Operation exposing (RootSubscription)
import Graphql.SelectionSet exposing (SelectionSet)
import Mutations
import State exposing (Receipt)


subscriptionDocument : Int -> SelectionSet (Maybe Receipt) RootSubscription
subscriptionDocument itemId =
    Gqllib.Subscription.receipt { itemId = itemId } Mutations.receipt
