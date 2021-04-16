from datetime import datetime
from ..models import MapIdsBSF,BsfCall
import requests


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



def get_events_deadline(_url):

    # This will avoid mod_security on the website, to avoid been blocked
    get_client = Request(_url, headers={'User-Agent': 'Mozilla/5.0'})

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


    # This will avoid mod_security on the website, to avoid been blocked
    get_client = Request(_url, headers={'User-Agent': 'Mozilla/5.0'})

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

    event_details = get_events_details(_url)
    field_name = []

    for event in event_details:
        word_search = re.search(r'\b(in)\b', event)
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


def get_bsf_call_by_tags(tags):
    """
       function to get all calls with at least one tag from the list of tags.
       :param tags: list of tags
       :return: list of organizations objects
       """
    tags = ''.join(tags)
    # print("TAGS", tags)
    index = reload_index('BsfIndex')
    # print("INDEX", index)
    corpus = NLP_processor([tags], 'BSF')
    # print("CORPUS", corpus)
    res = index[corpus]
    # print("AFTER RES")
    res = process_query_result(res)
    # print("AFTER PROCESS")
    res = [pair for pair in res if pair[1] > 0.3]
    res = sorted(res, key=lambda pair: pair[1], reverse=True)
    temp = []
    # print("AFTER SORT")
    for pair in res:
        try:
            temp.append(MapIdsBSF.objects.get(indexID=pair[0]))
        except:
            pass
    res = temp

    finalRes = []
    for mapId in res:
        finalRes.append(BsfCall.objects.get(CallID=mapId.originalID))

    return finalRes

def get_bsf_call_by(tags, first_date, second_date):

    tags_call = get_bsf_call_by_tags(tags)
    # print("Related call to "+tags+" is: ", tags_call)
    dates_call = get_bsf_call_by_dates(first_date, second_date)
    # print("Related call to " + first_date + " and "+second_date+ "is: ", dates_call)

    result = get_bsf_call_intersection(tags_call, dates_call)

    return result


def get_bsf_call_by_dates(first_date, second_date):

    calls = BsfCall.objects.all()

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


def get_bsf_call_intersection(tags_call, dates_call):

    result = []
    already_taken = set()

    for call in tags_call:
        already_taken.add(call.CallID)

    not_taken = set()
    for call in dates_call:
        if call.CallID in already_taken and call.CallID not in not_taken:
            result.append(call)
            not_taken.add(call.CallID)

    return result



