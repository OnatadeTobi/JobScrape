#!/bin/bash

# Exit on error
set -e

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Current DATABASE_URL: $DATABASE_URL"
python manage.py dbshell -c "SELECT current_database();"

# Start server
echo "Starting Gunicorn..."
exec gunicorn jobscaper_api.wsgi:application --bind 0.0.0.0:$PORT 