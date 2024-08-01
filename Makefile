# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: bkukaqi <bkukaqi@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/14 12:00:04 by mguerga           #+#    #+#              #
#    Updated: 2024/07/30 11:57:34 by bkukaqi          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME = ft_transcendence
PATH_DOCKER_COMPOSE = ./docker-compose.yaml
LOGIN = $(USER)
RESET_COLOR = \033[0m

#  === Exported Variables ===
ifeq ($(shell uname),Darwin)
	HOME = /Users/$(LOGIN)
else
	HOME = /home/$(LOGIN)
endif

export PATH_V := $(HOME)/data


export STUDENT_DOMAIN = localhost


all: 	makedir up

makedir: 
	if [ ! -d ${PATH_V} ]; then \
		mkdir -p ${PATH_V}; \
	fi
	

build:
		@docker-compose -f ${PATH_DOCKER_COMPOSE} -p ${NAME} build

up: 	
		@docker-compose -f ${PATH_DOCKER_COMPOSE} -p ${NAME} up -d

stop:
		docker compose -f ${PATH_DOCKER_COMPOSE} -p ${NAME} stop

down: 	
		@docker-compose -f ${PATH_DOCKER_COMPOSE} -p ${NAME} down

clean: 
		-@docker stop $$(docker ps -qa) 2>/dev/null
		-@docker rm $$(docker ps -qa) 2>/dev/null
		-@docker rmi -f $$(docker images -qa) 2>/dev/null
		-@docker volume rm $$(docker volume ls -q) 2>/dev/null
		-@docker network rm $$(docker network ls -q) 2>/dev/null

fclean: clean
		rm -rf ${PATH_V}

ps:
		@docker ps -a 

log:
		@make ps | docker-compose -f ${PATH_DOCKER_COMPOSE} -p ${NAME} logs  

re: 	fclean all

rebuild: build up

.PHONY: all makedir build up down clean fclean ps log re rebuild
