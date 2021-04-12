@echo on

@REM taken from https://stackoverflow.com/a/3827582/4188138
SET DIR=%~dp0

SET IMAGE_NAME=feel_tracker_server
cd %DIR%

@REM run build from parent directory so docker's COPY includes the dist directory
cd ..

@REM kill all running instances of our image, adapted from https://stackoverflow.com/a/57802962/4188138
FOR /F %%i IN ('docker ps -a -q --filter ancestor^=%IMAGE_NAME% --format="{{.ID}}"') DO docker stop %%i && docker rm %%i

docker build -t %IMAGE_NAME%  -f server\Dockerfile .
docker run -p 80:8080 -v "%DIR%persistent_data":/persistent_data -d %IMAGE_NAME%

FOR /F "tokens=* USEBACKQ" %%F IN (`docker ps -a -q --filter ancestor^=feel_tracker_server --format^="{{.ID}}"`) DO (
SET new_image_id=%%F
)
docker logs %new_image_id% --follow