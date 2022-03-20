# Use phusion/passenger-full as base image. To make your builds reproducible, make
# sure you lock down to a specific version, not to `latest`!
# See https://github.com/phusion/passenger-docker/blob/master/CHANGELOG.md for
# a list of version numbers.
# FROM phusion/passenger-full:2.1.0
# Or, instead of the 'full' variant, use one of these:
#FROM phusion/passenger-ruby23:<VERSION>
#FROM phusion/passenger-ruby24:<VERSION>
#FROM phusion/passenger-ruby25:<VERSION>
#FROM phusion/passenger-ruby26:<VERSION>
FROM phusion/passenger-ruby27:2.1.0
#FROM phusion/passenger-ruby30:<VERSION>
#FROM phusion/passenger-jruby93:<VERSION>
#FROM phusion/passenger-nodejs:<VERSION>
#FROM phusion/passenger-customizable:<VERSION>

LABEL Name=my_site_test Version=0.0.1

# Set correct environment variables.
ENV HOME /root

# Use baseimage-docker's init process.
CMD ["/sbin/my_init"]

# If you're using the 'customizable' variant, you need to explicitly opt-in
# for features.
#
# N.B. these images are based on https://github.com/phusion/baseimage-docker,
# so anything it provides is also automatically on board in the images below
# (e.g. older versions of Ruby, Node, Python).
#
# Uncomment the features you want:
#
#   Ruby support
#RUN /pd_build/ruby-2.4.*.sh
#RUN /pd_build/ruby-2.5.*.sh
#RUN /pd_build/ruby-2.6.*.sh
#RUN /pd_build/ruby-2.7.*.sh
#RUN /pd_build/ruby-3.0.*.sh
#RUN /pd_build/jruby-9.3.*.sh
#   Python support.
#RUN /pd_build/python.sh
#   Node.js and Meteor standalone support.
#   (not needed if you already have the above Ruby support)
#RUN /pd_build/nodejs.sh

# ...put your own build instructions here...
RUN rm -f /etc/service/nginx/down

RUN rm /etc/nginx/sites-enabled/default
ADD webapp.conf /etc/nginx/sites-enabled/webapp.conf
RUN mkdir /home/app/webapp
COPY --chown=app:app . /home/app/webapp

WORKDIR /home/app/webapp
RUN rvm-exec 2.7.5 bundle config set --local path 'vendor/bundle' && rvm-exec 2.7.5 bundle install

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
