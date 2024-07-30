# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mguerga <mguerga@42lausanne.ch>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/12 19:25:50 by mguerga           #+#    #+#              #
#    Updated: 2024/07/30 12:02:57 by mguerga          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM python:3.12-slim

ENV	PYTHONUNBUFFERED 1

COPY requirements.txt .
COPY ./mysite /mysite2
COPY ./players /players
COPY ./pong /pong

RUN apt-get update && \
	apt-get install wait-for-it && \
	pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["bash","/mysite2/django_init.sh"]
