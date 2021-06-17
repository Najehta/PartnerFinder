import os

import requests
from google_trans_new import google_translator
from selenium import webdriver
from bs4 import BeautifulSoup as soup, element
import re
import time as t
from datetime import datetime
from .QueryProcess import *
from ..models import MstCalls, MapIdsMST, UpdateTime
from langdetect import detect
import time



def get_calls(_url):

    """
    Method to fetch (scrape) all the calls data from MST website
    :param : website proposal calls url
    :return: proposal calls information
    """

    # please change this PATH to open chromedriver from your device
    try:
        PATH = '/Users/najeh/chromedriver'
        driver = webdriver.Chrome(PATH)
        driver.get(_url)

    except Exception as e:
        print(e)
        return

    translator = google_translator()

    call_name, link, deadline, about, deadline_date= [], [], [], [], []
    target_lang = 'en'

    try:
        t.sleep(1)
        page_html = driver.execute_script(
            'return document.getElementsByClassName("animate-container list-unstyled remove-last-speace ")[0].innerHTML')

        page_soup = soup(page_html, "html.parser")

        calls = page_soup.find_all("h2", {"class": "h4"})
        call_details = page_soup.find_all("span", {"class": "small-txt gray-txt result-prop"})
        call_info = page_soup.find_all("div", {"class": "txt dark-gray-txt ng-binding"})

        pattern = '^Voice call+'
        for item in calls:

            link.append(item.a.get('href'))
            result_lang = detect(item.a.text.strip())

            if result_lang == target_lang:
                call_name.append(item.a.text.strip())

            else:
                word_trans = translator.translate(item.a.text.strip())
                word_trans = re.sub(pattern, "Call", word_trans)
                call_name.append(word_trans)

        for item in call_details:

            temp = item.span.text.strip()
            temp1 = re.sub("[^0-9.]", "", temp)

            d1, m1, y1 = [int(x) for x in temp1.split('.')]
            b1 = datetime(y1, m1, d1)

            today = datetime.today()
            d1 = today.strftime("%d.%m.%Y")
            d2, m2, y2 = [int(x) for x in d1.split('.')]
            b2 = datetime(y2, m2, d2)

            if b1 < b2:
                deadline.append(temp1 + ' (Closed)')
                deadline_date.append(None)
            else:
                deadline_datetime = datetime.strptime(temp1, "%d.%m.%Y")
                deadline.append(temp1 + ' (Open)')
                deadline_date.append(deadline_datetime)

        for item in call_info:

            if len(item.text) == 1:
                about.append("Not Available")
            else:
                temp = item.text.replace("\r\n","")
                temp1 = re.sub("-", "", temp)
                result_lang = detect(temp1)

                if result_lang == target_lang:
                    about.append(temp1.strip())

                else:
                    about.append(translator.translate(temp1.strip()))
                    # about.append(temp1.strip()) # Remove # if you want the content in Hebrew
        t.sleep(1)


    except Exception as e:
        print("ERROR", e)
        t.sleep(1)

    t.sleep(1)
    driver.quit()
    list_of_data = list(zip(call_name, link, deadline, about, deadline_date))

    return list_of_data

def get_calls_number(_url):

    """
   Method to return the number of proposal calls
   :param : website proposal calls url
   :return: number of calls
   """
    try:

        PATH = '/Users/najeh/chromedriver'
        driver = webdriver.Chrome(PATH)
        driver.get(_url)

        t.sleep(1)

        page_html = driver.execute_script(
            'return document.getElementsByClassName("h1 reforma-medium xs-me-10 dark-blue-txt ng-binding")[0].innerHTML')

        page_soup = soup(page_html, "html.parser")
        calls_number = str(page_soup)
        calls_number = int(calls_number)

    except Exception as e:
        print(e)
        return

    driver.quit()

    return calls_number


def get_Mst_call_by(tags, first_date, second_date, call_status):

    """
   Method to return all the relevant calls by tags and dates
   :param : tags, date
   :return: related calls
   """

    tags_call = get_Mst_call_by_tags(tags)

    dates_call = get_Mst_call_by_dates(first_date, second_date)

    result = get_Mst_call_intersection(tags_call, dates_call, call_status)

    return result


def get_Mst_call_by_tags(tags):

    """
   Method to get all calls with at least one tag from the list of tags.
   :param tags: list of tags
   :return: list of organizations objects
   """
    finalRes = []
    calls = MstCalls.objects.all()

    if not tags:
        for call in calls:
            finalRes.append(call)

    else:

        if len(tags) == 1:

            tags = ' '.join(tags)
            index = reload_index('MstIndex')
            corpus = NLP_processor([tags], 'MST')
            res = index[corpus]
            res = process_query_result(res)

            res = [pair for pair in res if pair[1] > 0.2]
            res = sorted(res, key=lambda pair: pair[1], reverse=True)
            temp = []

            for pair in res:
                try:

                    temp.append(MapIdsMST.objects.get(indexID=pair[0]))

                except:
                    pass

            res = temp

        else:

            index = reload_index('MstIndex')
            temp = []
            res = ''
            for tag in tags:
                corpus = NLP_processor([tag], 'MST')
                res = index[corpus]
                res = process_query_result(res)

                res = [pair for pair in res if pair[1] > 0.3]
                res = sorted(res, key=lambda pair: pair[1], reverse=True)

                for pair in res:

                    try:
                            temp.append(MapIdsMST.objects.get(indexID=pair[0]))
                    except:
                        pass

                res = temp

        for mapId in res:
            finalRes.append(MstCalls.objects.get(CallID=mapId.originalID))

    return finalRes


def get_Mst_call_by_dates(first_date, second_date):

    """
   Method to return all the calls between dates
   :param : dates
   :return: calls that have deadline between this range
   """

    calls = MstCalls.objects.all()

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


def get_Mst_call_intersection(tags_call, dates_call, status):

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


def updateMST():

    """
       Method to update all the calls, and delete the old ones
       :return: nothing, only changing the data inside the DB
       """

    counter = 0
    _url = 'https://www.gov.il/he/departments/publications/?OfficeId=75d0cbd7-46cf-487b-930c-2e7b12d7f846&limit=10&publicationType=7159e036-77d5-44f9-a1bf-4500e6125bf1'

    if get_calls_number(_url) % 10 == 0:
        pages_number = get_calls_number(_url) // 10

    else:
        pages_number = (get_calls_number(_url) // 10) + 1

    today = datetime.today()
    date_passed = MstCalls.objects.filter(deadlineDate__lte=today)

    for item in date_passed:
        MapIdsMST.objects.get(originalID=item.CallID).delete()

    date_passed.delete()

    index = reload_index('MstIndex')
    print('Reloading MST Index...')

    try:

        data = get_calls(_url)
        call_name, link, deadline, about, deadline_date = zip(*data)
        call_name_list, link_list, deadline_list, about_list, deadline_date_list = list(call_name), list(link), list(
            deadline), list(about), list(deadline_date)

        for i, item in enumerate(call_name_list):

            try:

                existed_call = MstCalls.objects.get(organizationName=item, information=about_list[i])
                if existed_call.submissionDeadline != deadline_list[i]:
                    existed_call.submissionDeadline = deadline_list[i]
                    existed_call.save()

                else:
                    print("This call already exist ", item)

            except MstCalls.DoesNotExist:

                print("This call is not in the DB ", item)

                last_call = MstCalls.objects.latest('CallID')
                counter = last_call.CallID + 1

                if deadline_date_list[i] is None:

                    call = MstCalls(CallID=counter, organizationName=item, submissionDeadline=deadline_list[i],
                                    information=about_list[i], link=link_list[i], deadlineDate=deadline_date_list[i],
                                    open=False)
                else:

                    call = MstCalls(CallID=counter, organizationName=item, submissionDeadline=deadline_list[i],
                                    information=about_list[i], link=link_list[i], deadlineDate=deadline_date_list[i],
                                    open=True)

                call.save()

                originalID = i
                indexID = len(index)
                document = get_document_from_mst_call(call_name_list[i], about_list[i])
                newMap = MapIdsMST(originalID=originalID, indexID=indexID)
                newMap.save()
                index = add_document_to_curr_index(index, [document], 'MST')
                counter += 1

    except Exception as e:
        print(e)

    try:
        skip = 10
        while pages_number >= 2:

            if skip > 10:
                _url = _url[:-2]
                _url = _url + str(skip)
                new_url = re.sub("limit=10", "limit=" + str(skip + 10), _url)

            else:
                _url = _url + '&skip=' + str(skip)
                new_url = re.sub("limit=10", "limit=" + str(skip + 10), _url)

            data = get_calls(new_url)
            call_name, link, deadline, about, deadline_date = zip(*data)
            call_name_list, link_list, deadline_list, about_list, deadline_date_list = list(call_name), list(
                link), list(deadline), list(about), list(deadline_date)

            counter = MstCalls.objects.latest('CallID').CallID

            for i, item in enumerate(call_name_list):

                try:

                    existed_call = MstCalls.objects.get(organizationName=item, information=about_list[i])
                    if existed_call.submissionDeadline != deadline_list[i]:
                        existed_call.submissionDeadline = deadline_list[i]
                        existed_call.save()

                    else:
                        print("This call already exist ", item)

                except MstCalls.DoesNotExist:

                    print("This call is not in the DB ", item)

                    call = MstCalls(CallID=counter + 1, organizationName=item, submissionDeadline=deadline_list[i],
                                    information=about_list[i], link=link_list[i], deadlineDate=deadline_date_list[i])
                    call.save()

                    originalID = counter + 1
                    indexID = len(index)
                    document = get_document_from_mst_call(call_name_list[i], about_list[i])
                    newMap = MapIdsMST(originalID=originalID, indexID=indexID)
                    newMap.save()
                    index = add_document_to_curr_index(index, [document], 'MST')
                    counter += 1

            skip += 10
            pages_number -= 1

            if not setUpdateTime(mstDate=time.mktime(datetime.now().timetuple())):
                raise

    except Exception as e:
        print(e)
        setUpdateTime(mstDate=time.mktime(datetime.now().timetuple()))
        raise Exception


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