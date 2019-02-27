module Api exposing (..)
import Http
import String exposing (..)
import List exposing (..)
import Json.Decode exposing (list, string)

type Msg
  = GotItemSupplies (Result Http.Error (List String))

getItemSupplies : Cmd Msg
getItemSupplies =
    let qry =  "{items_supply(partialItemName:" ++ "\"wool\")" ++ "{ item {id name icon}, min_price quantity}}"

    in
        Http.post
            { url = "http://localhost:4000/"
            , body = Http.stringBody "text/plain" qry
            , expect = Http.expectJson GotItemSupplies (list string)
            }
