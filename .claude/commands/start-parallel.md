# Start All Clients and Servers

## Variables
FEATURE_NAME: $ARGUMENTS

## Instructions
Start both client and server instances for all worktrees of FEATURE_NAME.

RUN bash -lc "
feature=$FEATURE_NAME
base_client_port=5174
base_server_port=4000
i=0
for dir in trees/$feature-*; do
  client_port=$((base_client_port + i))
  server_port=$((base_server_port + i))
  echo Starting client: $dir/client on $client_port
  if [ -d \"$dir/client\" ]; then
    (cd \"$dir/client\" && npm run dev -- --port $client_port) &
  fi
  echo Starting server: $dir/server on $server_port
  if [ -d \"$dir/server\" ]; then
    (cd \"$dir/server\" && npm run dev -- --port $server_port) &
  fi
  i=$((i + 1))
done
echo 'All parallel instances started.'
"
