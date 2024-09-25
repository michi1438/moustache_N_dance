echo " POST_INIT.SH"

pg_ctl start -D /home/post_user/postDB/

createdb

psql << EOF
CREATE DATABASE $POSTGRES_DB;
CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASSWORD';
ALTER ROLE $POSTGRES_USER SET client_encoding TO 'utf8';
ALTER ROLE $POSTGRES_USER SET default_transaction_isolation TO 'read committed';
ALTER ROLE $POSTGRES_USER SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;
\c $POSTGRES_DB
GRANT CREATE ON SCHEMA public TO $POSTGRES_USER;
EOF

pg_ctl stop -D /home/post_user/postDB/

postgres -D /home/post_user/postDB -i
