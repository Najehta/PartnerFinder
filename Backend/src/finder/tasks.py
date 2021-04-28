from celery.schedules import crontab
from celery.task import periodic_task
import requests

#URL = 'http://62.90.89.14:8000/api/'
URL = 'http://127.0.0.1:8000/api/'


@periodic_task(run_every=(crontab(minute=0, hour=4, day_of_week='sun')),
               name="consortium_builder", ignore_result=True)
def consortium_builder():
    """
    automatic task that executes every week on sunday at 7:00 to build consortium and send mail to the user
    :return:
    """
    url = URL + 'calls/consortium_builder/'
    response = requests.get(url)


@periodic_task(run_every=(crontab(minute=0, hour=12, day_of_week='fri', day_of_month='1-7')),
               name="update_organizations", ignore_result=True)
def update_organizations():
    """
    automatic task that executes every month on first friday at 15:00 to update EU local DB
    :return:
    """
    url = URL + 'organizations/update_organizations/'
    response = requests.get(url)


@periodic_task(run_every=(crontab(minute=0, hour=12, day_of_week='fri', day_of_month='1-7')),
               name="update_events", ignore_result=True)
def update_events():
    """
    automatic task to update Events and participants from B2MATCH.
    :return:
    """
    url1 = URL + 'events/update_upcoming_events/'

    response = requests.get(url1)


@periodic_task(run_every=(crontab(minute=0, hour=4, day_of_week='sun')),
               name="update_events", ignore_result=True)
def b2match_alerts():
    url2 = URL + 'b2matchalerts/alertB2match/'
    response2 = requests.get(url2)
