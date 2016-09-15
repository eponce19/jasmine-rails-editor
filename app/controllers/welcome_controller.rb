require 'active_support/core_ext/string/filters'

class WelcomeController < ApplicationController
  def index
    @msg = "hola index"

    source = "specs/example.js"
    fileHtml = File.open(source, "r")
     begin
       text = File.open(source).read
     rescue
       text = false
     ensure
       #fileHtml.close unless fileHtml.nil?
     end
     @specText = text


  end
  def spec
    #code
  end
  def sandbox


    @msg = "hola sandbox"


    #code
  end
end
