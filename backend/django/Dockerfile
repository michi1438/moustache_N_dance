# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: bkukaqi <bkukaqi@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/12 19:25:50 by mguerga           #+#    #+#              #
#    Updated: 2024/08/19 10:28:10 by bkukaqi          ###   ########.fr        #
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

CMD ["bash","/mysite2/django_init.sh"]
