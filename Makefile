# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mguerga <mguerga@42lausanne.ch>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/14 12:00:04 by mguerga           #+#    #+#              #
#    Updated: 2024/07/14 12:03:09 by mguerga          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all: build up

re: down all

build:
	@docker-compose -f compose.yaml build
up:
	@docker-compose -f compose.yaml up -d 
down:
	@docker-compose -f compose.yaml down
ps:
	@docker-compose -f compose.yaml ps -a 
log:
	@make ps | docker-compose -f compose.yaml logs  
