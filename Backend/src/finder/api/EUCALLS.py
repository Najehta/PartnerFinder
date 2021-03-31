import requests
#from .NLP import *
#from ..models import MapIds, OrganizationProfile, Tag, Address, CallTag, Call
from dateutil.relativedelta import relativedelta
import time
from datetime import datetime
#from .Utils import *


def get_proposal_calls():
    """
    function to get all proposal calls for grants that are open and have at least three months deadline
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
        if 'type' in obj and obj['type'] == 1:
            obj = get_call_related_attributes(obj)
            obj = get_rest_attributes(obj)
            try:
                check_dates = [is_valid_date(date)
                               for date in obj['deadlineDatesLong']]
            except:
                continue

            if any(check_dates) and is_valid_status(obj) and is_relevant_action(obj):
                obj = get_call_to_save(obj)
                grants.append(obj)

    return grants

LIST_OF_CALLS_ATTRIBUTES = {'type', 'status', 'ccm2Id', 'identifier', 'title', 'callTitle',
                            'deadlineDatesLong', 'tags', 'keywords', 'sumbissionProcedure'}

REST_ATTRIBUTES = {'description', 'conditions',
                   'ccm2Id', 'focusArea', 'supportInfo', 'actions'}

def get_call_related_attributes(obj):
    """
    function to get related attributes from call object
    :param obj: call object
    :return: new call object with the related attributes
    """
    resObj = {}
    for atr in LIST_OF_CALLS_ATTRIBUTES:
        if atr in obj:
            resObj[atr] = obj[atr]
        else:
            resObj[atr] = ''

    return resObj

def get_rest_attributes(obj):
    """
    function to get specific attributes for call object from another API
    :param obj: call object
    :return: new call object with additional attributes
    """
    id = obj['identifier'].lower()
    url = 'https://ec.europa.eu/info/funding-tenders/opportunities/data/topicDetails/' + id + '.json'

    try:
        response = requests.get(url)
        response = response.json()['TopicDetails']
        for atr in REST_ATTRIBUTES:
            if atr in response:
                obj[atr] = response[atr]
            else:
                obj[atr] = ''
        return obj
    except:
        return {}



def is_valid_date(date):
    """
    function to check if the deadline is more than three months from now
    :param date: deadline date
    :return: True/False
    """
    try:
        date //= 1000
        three_months = datetime.now() + relativedelta(months=+3)
        three_months = time.mktime(three_months.timetuple())
        return date >= three_months
    except:
        return False

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

def is_relevant_action(obj):
    """
    function to check if the demand actions tags are being included in the call object actions
    :param obj: call object
    :return: True/False
    """
    tags = ['ia', 'ria']  # tags of actions from the client
    try:
        for action in obj['actions']:
            types = action['types']
            curr_tags = []
            for type in types:
                type = type.lower()
                type.replace('-', '')
                type.replace(' ', '')
                curr_tags.extend(type.lower())
            curr_tags = ''.join(curr_tags)
            for tag in tags:
                if tag in curr_tags:
                    return True
    except:
        return False

def get_call_to_save(obj):
    """
    function to return only relevant attributes to save in the inner DB
    :param obj: EU call object
    :return: call object to save
    """
    finalObj = {}
    for atr in LIST_OF_CALLS_ATTRIBUTES:
        try:
            if atr == 'tags' or atr == 'keywords':
                if 'tagsAndKeywords' in finalObj:
                    finalObj['tagsAndKeywords'].extend(obj[atr])
                else:
                    finalObj['tagsAndKeywords'] = [tag for tag in obj[atr]]
            elif atr == 'sumbissionProcedure' or atr == 'status':
                finalObj[atr] = obj[atr]['abbreviation']
            elif atr == 'deadlineDatesLong':
                finalObj[atr] = (max(obj['deadlineDatesLong']) // 1000)
            else:
                finalObj[atr] = obj[atr]
        except:
            finalObj[atr] = ''

    return finalObj

print(get_proposal_calls())