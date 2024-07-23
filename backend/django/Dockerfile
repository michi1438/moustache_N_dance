# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mguerga <mguerga@42lausanne.ch>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/12 19:25:50 by mguerga           #+#    #+#              #
#    Updated: 2024/07/23 20:09:57 by lzito            ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM python:3.12-slim

ENV	PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

RUN	django-admin startproject mysite

WORKDIR /mysite

RUN python3 manage.py startapp players
RUN python3 manage.py startapp pong

COPY ./mysite ./mysite
COPY ./players ./players
COPY ./pong ./pong

CMD ["bash","./mysite/django_init.sh"]
