import requests
from google_trans_new import google_translator
from selenium import webdriver
from bs4 import BeautifulSoup as soup, element
import re
import time as t
from datetime import datetime
from .QueryProcess import *
from ..models import MstCalls, MapIdsMST
from langdetect import detect


def get_calls(_url):

    """
    Method to fetch (scrape) all the calls data from MST website
    :param : website proposal calls url
    :return: proposal calls information
    """

    # please change this PATH to open chromedriver from your device
    PATH = '/Users/najeh/chromedriver'
    driver = webdriver.Chrome(PATH)
    driver.get(_url)
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

def get_calls_num(_url):

    """
   Method to return the number of proposal calls
   :param : website proposal calls url
   :return: number of calls
   """

    PATH = '/Users/najeh/chromedriver'
    driver = webdriver.Chrome(PATH)
    driver.get(_url)

    page_html = driver.execute_script(
        'return document.getElementsByClassName("h1 reforma-medium xs-me-10 dark-blue-txt ng-binding")[0].innerHTML')

    page_soup = soup(page_html, "html.parser")
    calls_number = str(page_soup)
    calls_number = int(calls_number)

    driver.quit()
    return calls_number


def get_Mst_call_by(tags, first_date, second_date):

    """
   Method to return all the relevant calls by tags and dates
   :param : tags, date
   :return: related calls
   """

    tags_call = get_Mst_call_by_tags(tags)
    # print("Related call to "+tags+" is: ", tags_call)
    dates_call = get_Mst_call_by_dates(first_date, second_date)
    # print("Related call to " + first_date + " and "+second_date+ "is: ", dates_call)

    result = get_Mst_call_intersection(tags_call, dates_call)

    return result


def get_Mst_call_by_tags(tags):

    """
   Method to get all calls with at least one tag from the list of tags.
   :param tags: list of tags
   :return: list of organizations objects
   """

    tags = ''.join(tags)
    index = reload_index('MstIndex')
    corpus = NLP_processor([tags], 'MST')
    res = index[corpus]
    res = process_query_result(res)

    res = [pair for pair in res if pair[1] > 0.1]
    res = sorted(res, key=lambda pair: pair[1], reverse=True)
    temp = []

    for pair in res:
        try:
            temp.append(MapIdsMST.objects.get(indexID=pair[0]))
        except:
            pass
    res = temp

    finalRes = []
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


def get_Mst_call_intersection(tags_call, dates_call):

    """
   Method to intersect all the calls result together
   :param : tags results, date results calls
   :return: calls list
   """

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


