#!/usr/bin/env ruby
# frozen_string_literal: true

require 'sinatra'

# use this to display the fontawesome icons in the attrs
set :haml, escape_attrs: false

basic_info = '404 Not Found: The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.'

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

get %r|/notes/(\d+)/?| do |num|
  begin
    haml :notes, locals: { num: num }
  rescue => e
    haml :error, locals: { error_info: e }
  end
end

get '/links/?' do
  haml :links
end

get '/rss/?' do
  headers 'Content-Type' => 'application/xml'
  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" << haml(:rss)
end

not_found do
  haml :error, locals: { error_info: basic_info }
end

error do
  'Sorry there was a nasty error - ' << env['sinatra.error'].message
end
