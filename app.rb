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

get '/favicon.ico' do
  send_file './static_files/icons/duck.ico'
end

get '/home/?' do
  haml :index
end

get '/s/?' do
  haml :result
end

get '/notes/?' do
  haml :notes
end

get '/links/?' do
  haml :links
end

get '/rss/?' do
  headers 'Content-Type' => 'application/xml'
  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" << haml(:rss)
end

not_found do
  haml :error
end

error do
  'Sorry there was a nasty error - ' + env['sinatra.error'].message
end
