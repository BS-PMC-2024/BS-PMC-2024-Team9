import pytest
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_oo.settings')

@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    pass

# Ensure Django setup is called
django.setup()