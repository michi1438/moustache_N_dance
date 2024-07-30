# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mguerga <mguerga@42lausanne.ch>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/14 12:00:04 by mguerga           #+#    #+#              #
#    Updated: 2024/07/30 12:58:21 by mguerga          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all: 	makedir up

makedir: 
		-@mkdir -p /home/$(USER)/data/db

build:
		@docker-compose -f docker-compose.yaml build --progress=plain

up: 	
		@docker-compose -f docker-compose.yaml up -d

down: 	
		@docker-compose -f docker-compose.yaml down

clean: 
		-@docker stop $$(docker ps -qa) 2>/dev/null
		-@docker rm $$(docker ps -qa) 2>/dev/null
		-@docker rmi -f $$(docker images -qa) 2>/dev/null
		-@docker volume rm $$(docker volume ls -q) 2>/dev/null
		-@docker network rm $$(docker network ls -q) 2>/dev/null

fclean: clean
		@sudo rm -rf /home/$(USER)/data

ps:
		@docker ps -a 

log:
		@make ps | docker-compose -f docker-compose.yaml logs  

re: 	fclean all

rebuild: build up

.PHONY: all makedir build up down clean fclean ps log re rebuild
