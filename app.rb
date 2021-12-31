require 'sinatra'

set :haml, :format => :html5

get '/' do
  status 302
  headers 'Location' => '/home'
end

get '/index/static_files/*' do |path|
  send_file "./static_files/#{path}"
end

get '/index/*' do |path|
  status 301
  headers 'Location' => "/#{path}"
end

get '/static_files/*' do |path|
  send_file "./static_files/#{path}"
end

get '/home/?' do
  haml :index
end

get '/s/?' do
  haml :result
end

get '/detail/?' do
  haml :detail
end

get '/notes/?' do
  haml :notes
end

get '/links/?' do
  haml :links
end

not_found do
  haml :error
end

error do
  'Sorry there was a nasty error - ' + env['sinatra.error'].message
end
