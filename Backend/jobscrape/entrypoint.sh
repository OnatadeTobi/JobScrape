#!/bin/bash
set -e

echo "Running migrations..."
python manage.py migrate --noinput || { echo "Migration failed"; exit 1; }

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Current DATABASE_URL: $DATABASE_URL"

echo "Starting Gunicorn..."
exec gunicorn jobscaper_api.wsgi:application --bind 0.0.0.0:$PORT --workers 1



# #!/bin/bash

# # Exit on error
# set -e

# # Run migrations
# echo "Running migrations..."
# python manage.py migrate --verbosity 3 || { echo "Migration failed"; exit 1; }

# # Collect static files
# echo "Collecting static files..."
# python manage.py collectstatic --noinput

# echo "Current DATABASE_URL: $DATABASE_URL"
# python manage.py dbshell -c "SELECT current_database();"

# # Start server
# echo "Starting Gunicorn..."
# exec gunicorn jobscaper_api.wsgi:application --bind 0.0.0.0:$PORT 