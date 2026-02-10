#!/bin/bash
set -e

node /app/backend/server.js &
backend_pid=$!

nginx -g 'daemon off;' &
nginx_pid=$!

trap 'kill -TERM $backend_pid $nginx_pid' SIGTERM SIGINT

wait -n $backend_pid $nginx_pid
status=$?

kill -TERM $backend_pid $nginx_pid 2>/dev/null || true
wait 2>/dev/null || true

exit $status
