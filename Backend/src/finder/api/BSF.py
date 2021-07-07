import os
from datetime import datetime
from ..models import MapIdsBSF, bsfCalls, UpdateTime, bsfCalls1
import requests
import time

# from selenium import webdriver
import nltk
from nltk import tokenize
from operator import itemgetter
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from bs4 import BeautifulSoup as soup, element
from urllib.request import urlopen as req
from time import sleep
import math
from orderedset import OrderedSet
from urllib.request import urlopen as req
from urllib.request import Request
import re
from .QueryProcess import *
from .Utils import setUpdateTime



def get_events_deadline(_url):

    """
      Method to fetch all the calls deadline from BSF website
      :param : website proposal calls url
      :return: proposal calls deadline date
      """

    # This will avoid mod_security on the website, to avoid been blocked
    get_client = Request(_url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'})

    # grab the page html
    page_html = req(get_client).read()

    # html parsing
    page_soup = soup(page_html, "html.parser")

    # grab all the lists that contain the wanted data
    lists_containers = page_soup.find_all("li", {"class": "list-item"})
    # print(lists_containers)


    deadline= []
    date = []
    for container in lists_containers:
        if 'Deadline for' in container.div.text:
            temp = container.h3.text
            temp = temp.replace(',', '')
            date = temp.split()
            month_datetime = datetime.strptime(date[0], "%B")
            month_number = month_datetime.month
            date[0] = str(month_number)
            date[0], date[1] = date[1], date[0]
            date_string = '/'.join(date)
            date_datetime = datetime.strptime(date_string,"%d/%m/%Y")
            deadline.append(date_datetime)

    return deadline


def get_events_details(_url):

    """
      Method to fetch the calls information from the website
      :param : website proposal calls url
      :return: proposal calls information
      """

    # This will avoid mod_security on the website, to avoid been blocked
    get_client = Request(_url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'})

    # grab the page html
    page_html = req(get_client).read()

    # html parsing
    page_soup = soup(page_html, "html.parser")

    # grab all the lists that contain the wanted data
    lists_containers = page_soup.find_all("li", {"class": "list-item"})

    event_details = []

    for container in lists_containers:
        if 'Deadline for' in container.div.text:
            event_details.append(container.div.text)


    return event_details


def get_field_name(_url):

    """
      Method to extract the field name from the context using Regex
      :param : website proposal calls url
      :return: proposal calls field name
      """

    event_details = get_events_details(_url)
    field_name = []

    for event in event_details:
        word_search = re.search(r'\b(in)\b', event)

        if not word_search:
            field_name.append('Unknown')
            continue

        field_start_index = word_search.start() + 2
        if ';' not in event:
            word_search = re.search(r'[(]', event)
            field_end_index = word_search.start()
            field_name.append(event[field_start_index + 1:field_end_index - 1])
        else:
            event_field = event[field_start_index + 1: ]
            event_field = [re.split(r'( - Theory)|\(.*\)', i)[0].strip() for i in event_field.split(';')]
            field_name.append(''.join(event_field))

    return field_name


def make_csv_file(lists_containers):

    """
      Method to make csv file from the available proposal calls
      :param : open deadline calls
      :return: nothing
      """

    # open an excel sheet to save the data
    excel_file = "BSF-Events.csv"
    f = open(excel_file, "w")
    file_headers = "Deadline Date, Description\n"
    f.write(file_headers)
    for container in lists_containers:
        deadline = container.h3.text
        description = container.div.text
        f.write(deadline.replace(",", "") + "," + description + "\n")
    f.close()


def get_bsf_call_by(tags, first_date, second_date, call_status):

    """
    Method to return all the relevant calls by tags and dates
    :param : tags, date
    :return: related calls
    """

    tags_call = get_bsf_call_by_tags(tags)

    dates_call = get_bsf_call_by_dates(first_date, second_date)

    result = get_bsf_call_intersection(tags_call, dates_call, call_status)

    return result



def get_bsf_call_by_tags(tags):

    """
       Method to get all calls with at least one tag from the list of tags.
       :param tags: list of tags
       :return: list of organizations objects
       """
    finalRes = []

    calls = bsfCalls.objects.all()

    if not tags:
        for call in calls:
            finalRes.append(call)

    else:

        if len(tags) == 1:

            tags = ' '.join(tags)
            index = reload_index('C:/Users/FinalProject/Desktop/PartnerFinder/Backend/src/Index/BsfIndex')
            corpus = NLP_processor([tags], 'BSF')
            res = index[corpus]
            res = process_query_result(res)

            res = [pair for pair in res if pair[1] > 0.3]
            res = sorted(res, key=lambda pair: pair[1], reverse=True)
            temp = []

            for pair in res:
                try:

                    temp.append(MapIdsBSF.objects.get(indexID=pair[0]))

                except:
                    pass

            res = temp

        else:
            index = reload_index('C:/Users/FinalProject/Desktop/PartnerFinder/Backend/src/Index/BsfIndex')
            temp = []
            res = ''
            for tag in tags:
                corpus = NLP_processor([tag], 'BSF')
                res = index[corpus]
                res = process_query_result(res)

                res = [pair for pair in res if pair[1] > 0.3]
                res = sorted(res, key=lambda pair: pair[1], reverse=True)

                for pair in res:

                    try:
                        temp.append(MapIdsBSF.objects.get(indexID=pair[0]))
                    except:
                        pass

                res = temp


        for mapId in res:
            finalRes.append(bsfCalls.objects.get(CallID=mapId.originalID))

    return finalRes




def get_bsf_call_by_dates(first_date, second_date):

    """
         Method to return all the calls between dates
         :param : dates
         :return: calls that have deadline between this range
         """

    calls = bsfCalls.objects.all()

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


def get_bsf_call_intersection(tags_call, dates_call, status):

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


def updateBSF():

    """
       Method to update all the calls, and delete the old ones
       :return: nothing, only changing the data inside the DB
       """

    updated = False
    bsfCalls1.objects.all().delete()
    _url = 'https://www.bsf.org.il/calendar/'
    deadline = get_events_deadline(_url)  # deadline is a list of strings
    event_details = get_events_details(_url)  # event_details is a list of strings
    field_name = get_field_name(_url)  # field_name is a list of strings


    try:
        for i, item in enumerate(deadline):

            date = bsfCalls1(CallID=i, deadlineDate=item, organizationName='NSF-BSF', information=event_details[i],
                            areaOfResearch=field_name[i], link='https://www.bsf.org.il/calendar/', open=True)
            date.save()

        updated = True

    except Exception as e:
        print(e)
        updated = False

    return updated


def copy_to_original_BSF():

    bsfCalls.objects.all().delete()
    MapIdsBSF.objects.all().delete()
    try:
        os.remove('C:/Users/FinalProject/Desktop/PartnerFinder/Backend/src/Index/BsfIndex')
        os.remove('C:/Users/FinalProject/Desktop/PartnerFinder/Backend/src/Index/BsfIndex.0')
        os.remove('C:/Users/FinalProject/Desktop/PartnerFinder/Backend/src/Index/Dictionary_BSF')
        print('Deleting BSF original Index...')
        
    except Exception as e:
        pass

    index = make_index('C:/Users/FinalProject/Desktop/PartnerFinder/Backend/src/Index/BsfIndex', 'BSF')
    print('Building BSF Index...')

    try:
        all_new_calls = bsfCalls1.objects.all()

        for i, item in enumerate (all_new_calls):

            new_call = bsfCalls(CallID=item.CallID, deadlineDate=item.deadlineDate, organizationName='NSF-BSF', information=item.information,
                            areaOfResearch=item.areaOfResearch, link='https://www.bsf.org.il/calendar/', open=True)
            new_call.save()

            originalID = i
            indexID = len(index)
            document = get_document_from_bsf_call(item.information, item.areaOfResearch)
            newMap = MapIdsBSF(originalID=originalID, indexID=indexID)
            newMap.save()                                                                  
            index = add_document_to_curr_index(index, [document], 'BSF')

    except Exception as e:
        print(e)

    try:
        if not setUpdateTime(bsfDate=time.mktime(datetime.now().timetuple())):
            raise
        
    except Exception as e:
        print(e)
        setUpdateTime(bsfDate=time.mktime(datetime.now().timetuple()))
