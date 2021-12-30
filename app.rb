require 'sinatra'

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

get '/home' do
  haml :index
end