import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onInput)



-- MAIN


main =
  Browser.sandbox { init = init, update = update, view = view }



-- MODEL



type alias Model =
  { userName : String
  , searchTerm : String
  , passwordAgain : String
  }


init : Model
init =
  Model "" "" ""



-- UPDATE


type Msg
  = SEARCH_TERM_CHANGED String



update : Msg -> Model -> Model
update msg model =
  case msg of
    SEARCH_TERM_CHANGED val ->
      { model | searchTerm = val }


-- VIEW


view : Model -> Html Msg
view model =
  div [][]
