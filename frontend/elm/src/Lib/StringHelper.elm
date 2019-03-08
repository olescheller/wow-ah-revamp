module Lib.StringHelper exposing (..)

import Maybe exposing (withDefault)
import State exposing (Item)

amazonS3url : String
amazonS3url =
     "https://s3.eu-central-1.amazonaws.com/wow-icons/icons/"

standardIconName : String
standardIconName =
    "inv_misc_questionmark"

iconPostFix : String
iconPostFix =
    ".jpg"


getItemIconUrl : Item -> String
getItemIconUrl item =
    amazonS3url ++ withDefault standardIconName item.icon ++ iconPostFix