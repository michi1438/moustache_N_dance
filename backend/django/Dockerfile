# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: robin <robin@student.42.fr>                +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/12 19:25:50 by mguerga           #+#    #+#              #
#    Updated: 2024/09/01 15:54:33 by robin            ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM python:3.12-slim

ENV	PYTHONUNBUFFERED 1

COPY create_certs.sh /.


COPY requirements.txt .
COPY ./mysite /mysite2
COPY ./players /players
COPY ./pong /pong

RUN apt-get update && \
	apt-get install wait-for-it && \
	pip install --upgrade pip && \
	pip install --no-cache-dir -r requirements.txt && \
	sh /create_certs.sh	

EXPOSE 8000

RUN	django-admin startproject mysite

WORKDIR /mysite

RUN python3 manage.py startapp players
RUN python3 manage.py startapp tournaments

COPY ./mysite ./mysite
COPY ./players ./players
COPY ./tournaments ./tournaments

CMD ["bash","./mysite/django_init.sh"]
