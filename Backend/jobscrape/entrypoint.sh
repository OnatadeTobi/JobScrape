#!/bin/bash

# Exit on error
set -e

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Start server
exec gunicorn jobscaper_api.wsgi:application --bind 0.0.0.0:$PORT 