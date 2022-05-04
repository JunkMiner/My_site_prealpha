#!/usr/bin/env ruby
# frozen_string_literal: true

require 'sinatra/base'

class MyApp < Sinatra::Base
  # use this to display the fontawesome icons in the attrs
  set :haml, escape_attrs: false

  Tilt.prefer Tilt::RDiscountTemplate

  basic_info = '404 Not Found: The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.'

  get %r{/|/home/?} do
    haml :index
  end

  get %r{(/index)?/static_files/(.+)} do |_, path|
    send_file "./static_files/#{path}"
  end

  get '/index/*' do |path|
    status 301
    headers 'Location' => "/#{path}"
  end

  get '/favicon.ico' do
    send_file './static_files/icons/duck.ico'
  end

  get '/s/?' do
    haml :result
  end

  get '/notes/?' do
    haml :list_notes
  end

  get %r{/notes/(\d+)/?} do |num|
    begin
      haml :notes, locals: { num: num }
    rescue StandardError => e
      status 500
      haml :error, locals: { error_info: e, status_num: '500' }
    end
  end

  get '/links/?' do
    haml :links
  end

  get '/rss/?' do
    headers 'Content-Type' => 'application/xml'
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n#{haml(:rss)}"
  end

  get '/ip/*/?' do |ip|
    haml :ip_address, locals: { ip_address: ip }
  end

  not_found do
    haml :error, locals: { error_info: basic_info, status_num: '404' }
  end

  error do
    "Sorry there was a nasty error - #{env['sinatra.error'].message}"
  end
end
