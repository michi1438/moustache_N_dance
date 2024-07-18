# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mguerga <mguerga@42lausanne.ch>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/07/12 19:25:50 by mguerga           #+#    #+#              #
#    Updated: 2024/07/18 11:44:58 by lzito            ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM alpine:3.20.1

RUN apk update && \
	apk add --no-cache postgresql16 py3-psycopg && \
	adduser -D post_user && \
	mkdir -p /run/postgresql/ && \
	chown post_user:post_user /run/postgresql/

USER post_user

RUN mkdir -p /home/post_user/postDB/ && \
	touch /home/post_user/post.log && \
	pg_ctl init -D home/post_user/postDB/ -l /home/post_user/post.log && \
	ln -sf /dev/stdout /home/post_user/post.log

COPY pg_hba.conf /home/post_user/postDB/.
COPY postgresql.conf /home/post_user/postDB/.

EXPOSE 5432

CMD ["postgres16", "-D", "/home/post_user/postDB", "-h", "*" ]
