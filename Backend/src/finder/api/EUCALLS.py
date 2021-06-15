import requests
#from .NLP import *
#from ..models import MapIds, OrganizationProfile, Tag, Address, CallTag, Call
from dateutil.relativedelta import relativedelta
import time
from datetime import datetime
#from .Utils import *


def get_eu_calls():
    """
    function to get all proposal calls for grants that are open
    :return: list of object of open calls
    """

    url = 'https://ec.europa.eu/info/funding-tenders/opportunities/data/referenceData/grantsTenders.json'
    try:
        response = requests.get(url)
    except requests.exceptions.RequestException as err:
        print("Error - ", err)
        return []

    res = response.json()['fundingData']['GrantTenderObj']
    grants = []
    for obj in res:
        #obj['workProgrammepart']['wp_website']
        if 'type' in obj and obj['type'] == 1:
            obj = get_attributes(obj)

            if is_valid_status(obj) :

                grants.append(obj)

    print('Number of calls: ', len(grants))
    return grants

LIST_OF_CALLS_ATTRIBUTES = {'type', 'status', 'ccm2Id', 'identifier', 'title', 'callTitle',
                            'deadlineDatesLong', 'tags', 'keywords', 'sumbissionProcedure', 'workProgrammepart'}


def get_attributes(obj):
    """
    function to get related attributes from call object
    :param obj: call object
    :return: new call object with the related attributes
    """
    resObj = {}
    for atr in LIST_OF_CALLS_ATTRIBUTES:

        if 'deadlineDatesLong' in atr:
            time_stamp = obj['deadlineDatesLong'][0]
            time_stamp = time_stamp // 1000
            dt_object = datetime.fromtimestamp(time_stamp)
            resObj[atr] = dt_object

        elif 'tags' in atr and 'tags' in obj:
            keyword_str = ', '.join(obj[atr])
            resObj[atr] = keyword_str

        elif 'workProgrammepart' in atr and 'workProgrammepart' in obj:

            if 'wp_website' in obj ['workProgrammepart']:
                resObj['link'] = obj['workProgrammepart']['wp_website']
            else:
                resObj['link'] = 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search'

        elif 'workProgrammepart' in atr and 'workProgrammepart'  not in obj:
            resObj['workProgrammepart'] = ''
            resObj['link'] = 'https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-search'

        elif atr in obj:
            resObj[atr] = obj[atr]

        else:
            resObj[atr] = ''

    return resObj


def is_valid_status(obj):
    """
    function to check if the status of a certain call is not closed yet
    :param obj: call object
    :return: True/False
    """
    try:
        return obj['status']['abbreviation'] != 'Closed'
    except:
        return False


# print(get_eu_calls())