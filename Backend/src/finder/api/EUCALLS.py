import requests
from .QueryProcess import *
from ..models import MapIdsEU, EuCalls, UpdateTime
from datetime import datetime
import time



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


def get_eu_call_by(tags, first_date, second_date, call_status):

    """
    Method to return all the relevant calls by tags and dates
    :param : tags, date
    :return: related calls
    """

    tags_call = get_eu_call_by_tags(tags)

    dates_call = get_eu_call_by_dates(first_date, second_date)

    result = get_eu_call_intersection(tags_call, dates_call, call_status)

    return result



def get_eu_call_by_tags(tags):

    """
       Method to get all calls with at least one tag from the list of tags.
       :param tags: list of tags
       :return: list of organizations objects
       """

    finalRes = []

    calls = EuCalls.objects.all()

    if not tags:
        for call in calls:
            finalRes.append(call)

    else:

        if len(tags) == 1:

            tags = ' '.join(tags)
            index = reload_index('EuIndex')
            corpus = NLP_processor([tags], 'EU')
            res = index[corpus]
            res = process_query_result(res)

            res = [pair for pair in res if pair[1] > 0.2]
            res = sorted(res, key=lambda pair: pair[1], reverse=True)
            temp = []

            for pair in res:
                try:

                    temp.append(MapIdsEU.objects.get(indexID=pair[0]))

                except:
                    pass

            res = temp

        else:
            index = reload_index('EuIndex')
            temp = []
            res = ''
            for tag in tags:
                corpus = NLP_processor([tag], 'EU')
                res = index[corpus]
                res = process_query_result(res)

                res = [pair for pair in res if pair[1] > 0.2]
                res = sorted(res, key=lambda pair: pair[1], reverse=True)

                for pair in res:

                    try:
                        temp.append(MapIdsEU.objects.get(indexID=pair[0]))
                    except:
                        pass

                res = temp


        for mapId in res:
            finalRes.append(EuCalls.objects.get(CallID=mapId.originalID))

    return finalRes




def get_eu_call_by_dates(first_date, second_date):

    """
         Method to return all the calls between dates
         :param : dates
         :return: calls that have deadline between this range
         """

    calls = EuCalls.objects.all()

    if not first_date and not second_date:
        return calls

    elif not first_date and second_date:
        from_date = datetime.strptime(second_date, "%d/%m/%Y")
        return calls.filter(deadlineDate__lte = from_date)

    elif first_date and not second_date :
        to_date = datetime.strptime(first_date, "%d/%m/%Y")
        return calls.filter(deadlineDate__gte=to_date)

    else:

        from_date = datetime.strptime(first_date, "%d/%m/%Y")
        to_date = datetime.strptime(second_date, "%d/%m/%Y")
        return calls.filter(deadlineDate__gte=from_date, deadlineDate__lte=to_date)


def get_eu_call_intersection(tags_call, dates_call, status):

    """
      Method to intersect all the calls result together
      :param : tags results, date results calls
      :return: calls list
      """

    call_status = False

    if 'Open and Closed' in status:

        result = []
        already_taken = set()

        for call in tags_call:
            already_taken.add(call.CallID)

        not_taken = set()
        for call in dates_call:
            if call.CallID in already_taken and call.CallID not in not_taken:
                result.append(call)
                not_taken.add(call.CallID)

    else:

        if status == 'Open':
            call_status = True

        if status == 'Closed':
            call_status = False

        result = []
        already_taken = set()

        for call in tags_call:
            if call.open == call_status:
                already_taken.add(call.CallID)

            else:
                pass

        not_taken = set()
        for call in dates_call:
            if call.CallID in already_taken and call_status == call.open and call.CallID not in not_taken:
                result.append(call)
                not_taken.add(call.CallID)

    return result

def updateEU():

    """
       Method to update all the calls, and delete the old ones
       :return: nothing, only changing the data inside the DB
       """

    today = datetime.today()
    date_passed = EuCalls.objects.filter(deadlineDate__lte=today).delete()

    for item in date_passed:
        MapIdsEU.objects.get(originalID=item.CallID).delete()

    date_passed.delete()

    calls_obj = get_eu_calls()

    index = reload_index('EuIndex')
    print('Reloading EU Index...')

    try:

        for i, item in enumerate(calls_obj):

            try:

                EuCalls.objects.get(ccm2Id=calls_obj[i]['ccm2Id'])
                print("This call already exist ", calls_obj[i]['callTitle'])

            except EuCalls.DoesNotExist:

                print("This call is not in the DB ", calls_obj[i]['callTitle'])

                latest_id = EuCalls.objects.latest('CallID')

                newCall = EuCalls(CallID=latest_id.CallID + 1,
                                  organizationName=calls_obj[i]['identifier'],
                                  information=calls_obj[i]['title'],
                                  title=calls_obj[i]['callTitle'],
                                  areaOfResearch=calls_obj[i]['tags'],
                                  link=calls_obj[i]['link'],
                                  deadlineDate=calls_obj[i]['deadlineDatesLong'], open=True)
                newCall.save()

                originalID = latest_id.CallID + 1
                indexID = len(index)
                document = get_document_from_eu_call(calls_obj[i]['identifier'], calls_obj[i]['title'],calls_obj[i]['tags'])
                newMap = MapIdsEU(originalID=originalID, indexID=indexID)
                newMap.save()
                index = add_document_to_curr_index(index, [document], 'EU')


        if not setUpdateTime(euDate=time.mktime(datetime.now().timetuple())):
            raise

    except Exception as e:
        print(e)
        setUpdateTime(euDate=time.mktime(datetime.now().timetuple()))


def setUpdateTime(euDate=None, technionDate=None, isfDate=None, mstDate=None, innovationDate=None, bsfDate=None ):
    """
    function to update the last update date
    :param euDate: EU last update
    :param technionDate: Technion last update
    :param isfDate: ISF last update
    :param mstDate: MST last update
    :param innovationDate: Innovation last update
    :param bsfDate: BSF last update
    :return: True/False
    """

    if not technionDate and not euDate and not isfDate and not mstDate and not innovationDate and not bsfDate:
        return False

    if euDate:
        euDate = int(euDate)
    if technionDate:
        technionDate = int(technionDate)
    if isfDate:
        isfDate = int(isfDate)
    if mstDate:
        mstDate = int(mstDate)
    if innovationDate:
        innovationDate = int(innovationDate)
    if bsfDate:
        bsfDate = int(bsfDate)

    try:
        UpdateTime.objects.get(ID=1)
        if euDate:
            UpdateTime.objects.filter(ID=1).update(eu_update=euDate)
        if technionDate:
            UpdateTime.objects.filter(ID=1).update(technion_update=technionDate)
        if isfDate:
            UpdateTime.objects.filter(ID=1).update(isf_update=isfDate)
        if bsfDate:
            UpdateTime.objects.filter(ID=1).update(bsf_update=bsfDate)
        if mstDate:
            UpdateTime.objects.filter(ID=1).update(mst_update=mstDate)
        if innovationDate:
            UpdateTime.objects.filter(ID=1).update(innovation_update=innovationDate)

    except:
        Update_Time = UpdateTime(eu_update=euDate,
                                 technion_update=technionDate,
                                 isf_update=isfDate,
                                 bsf_update=bsfDate,
                                 mst_update=mstDate,
                                 innovation_update=innovationDate,
                                 ID=1)
        Update_Time.save()

    return True