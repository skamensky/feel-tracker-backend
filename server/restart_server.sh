set -e

# Taken from https://stackoverflow.com/a/246128/4188138
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

IMAGE_NAME=feel_tracker_server
cd $DIR
# kill all running instances of our image
docker rm $(docker stop $(docker ps -a -q --filter ancestor=$IMAGE_NAME --format="{{.ID}}")) || true

docker build -t $IMAGE_NAME .
docker run -p 80:3000 -v "$(dirname $(pwd))":/app -d $IMAGE_NAME
