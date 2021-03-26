set -e

# Taken from https://stackoverflow.com/a/246128/4188138
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

IMAGE_NAME=feel_tracker_server
cd $DIR

# run build from parent directory so docker's COPY includes the dist directory
cd ..
# kill all running instances of our image
docker rm $(docker stop $(docker ps -a -q --filter ancestor=$IMAGE_NAME --format="{{.ID}}")) || true

docker build -t $IMAGE_NAME  -f server/Dockerfile .
docker run -p 80:8080 -v "$(dirname $(pwd))/persistent_data":/persistent_data -d $IMAGE_NAME
