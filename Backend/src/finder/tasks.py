import shared as shared
from celery.schedules import crontab
from celery.task import periodic_task, task
from celery import shared_task
import requests
from .api.BSF import updateBSF
from .api.EUCALLS import updateEU
from .api.ISF import updateISF
from .api.Innovation import updateINNOVATION
from .api.MST import updateMST
from .api.Technion import updateTechnion

URL = 'http://62.90.89.14:8000/api/'


# URL = 'http://127.0.0.1:8000/api/'


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


@periodic_task(run_every=(crontab(minute=0, hour=4, day_of_week='sun')),
               name="Update BSF Proposal Calls", ignore_result=True)

def add_bsfcalls_to_db():

    """
    automatic task that executes every week on sunday at 7:00 AM to update BSF calls
    :return:
    """

    url = URL + 'bsfcalls/add_bsfcalls_to_db/'
    response = requests.get(url)


@periodic_task(run_every=(crontab(minute=0, hour=4, day_of_week='sun')),
               name="Update BSF Proposal Calls", ignore_result=True)

def add_isfcalls_to_db():

    """
    automatic task that executes every week on sunday at 7:05 AM to update ISF calls
    :return:
    """

    url = URL + 'isfcalls/add_isfcalls_to_db/'
    response = requests.get(url)


@periodic_task(run_every=(crontab(minute=5, hour=4, day_of_week='sun')),
               name="Update ISF Proposal Calls", ignore_result=True)

def add_innovcalls_to_db():

    """
    automatic task that executes every week on sunday at 7:15 AM to update Innovation Israel calls
    :return:
    """

    url = URL + 'innovcalls/add_innovcalls_to_db/'
    response = requests.get(url)


@periodic_task(run_every=(crontab(minute=15, hour=4, day_of_week='sun')),
               name="Update Innovation Israel Proposal Calls", ignore_result=True)

def add_mstcalls_to_db():

    """
    automatic task that executes every week on sunday at 7:25 AM to update MST calls
    :return:
    """

    url = URL + 'mstcalls/add_mstcalls_to_db/'
    response = requests.get(url)


@periodic_task(run_every=(crontab(minute=25, hour=4, day_of_week='sun')),
               name="Update MST Proposal Calls", ignore_result=True)


def add_technioncalls_to_db():

    """
    automatic task that executes every week on sunday at 7:40 AM to update Technion calls
    :return:
    """

    url = URL + 'technioncalls/add_technioncalls_to_db/'
    response = requests.get(url)


@periodic_task(run_every=(crontab(minute=40, hour=4, day_of_week='sun')),
               name="Update Technion Proposal Calls", ignore_result=True)

def add_eucalls_to_db():

    """
    automatic task that executes every week on sunday at 8:10 AM to update EU calls
    :return:
    """

    url = URL + 'eucalls/add_eucalls_to_db/'
    response = requests.get(url)


@periodic_task(run_every=(crontab(minute=10, hour=5, day_of_week='sun')),
               name="Update Technion Proposal Calls", ignore_result=True)



def send_emails():

    """
    automatic task that executes every week on sunday at 10:00 AM to send proposal calls to the subscribed email list
    :return:
    """

    url = URL + 'EmailSubscription/send_emails/'
    response = requests.get(url)


@shared_task()
def bsf_update_task():

    try:
        updateBSF()

    except Exception as e:
        print(e)


@shared_task()
def isf_update_task():

    try:
        updateISF()

    except Exception as e:
        print(e)

@shared_task()
def innovation_update_task():

    try:
        updateINNOVATION()

    except Exception as e:
        print(e)


@shared_task()
def mst_update_task():

    try:
        updateMST()

    except Exception as e:
        print(e)


@shared_task()
def technion_update_task():

    try:
        updateTechnion()

    except Exception as e:
        print(e)


@shared_task()
def eu_update_task():

    try:
        updateEU()

    except Exception as e:
        print(e)

