require File.join(File.dirname(__FILE__),"../config.rb")

service_item "Common" do
  catalog CATALOG_NAME
  categories ""
  type "Portal"
  description "Pass through service for callbacks"
  display_page COMMON_PAGE
  display_name "#{DISPLAY_NAME_FOR_URL}-Common"
  web_server WEB_SERVER
  authentication :default
  allow_anonymous true
  page "Initial Page",
    :contents,
    :horizontal_buttons,
    :submit_button_value => "Submit" do
  end
end
