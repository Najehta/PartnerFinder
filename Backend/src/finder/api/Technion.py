import os
from datetime import datetime

from .Utils import setUpdateTime
from ..models import MapIdsTechnion, TechnionCalls, UpdateTime, TechnionCalls1
import requests
import time

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
from selenium import webdriver
from .QueryProcess import *


def get_calls_data(_url):

    """
      Method to scrape all the proposal calls from Technion website
      :param : _url
      :return: object that contain arrays
      """

    field, link, title, date = [], [], [], []
    data = {}

    try:

        #PATH = '/Users/najeh/chromedriver'
        PATH = 'C:\ChromeDriver\chromedriver.exe'
        driver = webdriver.Chrome(PATH)
        driver.get(_url)

        page_html = driver.page_source
        page_soup = soup(page_html, "html.parser")

        sleep(1)

        field_element = page_soup.find_all("td", {"class": "three area"})
        for item in field_element:
            if len(item.text) != 0:
                field.append(item.text)
            else:
                field.append('Not Available')


        link_element = page_soup.find_all("td", {"class": "two kore"})
        for item in link_element:
            link.append(item.a['href'])


        title_element = page_soup.find_all("td", {"class": "two kore"})
        for item in title_element:
            if len(item.a.text) != 0:
                title.append(item.a.text)
            else:
               title.append('Not Available')


        date_element = page_soup.find_all("td", {"class": ""})
        for item in date_element:
            temp = item.text.strip()
            date.append(datetime.strptime(temp, "%d/%m/%y"))

        sleep(1)
        driver.quit()

    except Exception as e:
        print(e)


    data['title'] = title
    data['date'] = date
    data['field'] = field
    data['link'] = link

    return data

def get_call_information(links):

    """
      Method to scrape and information inside the call link t
      :param : _url
      :return: calls information
      """

    information = ''

    try:
        #PATH = '/Users/najeh/chromedriver'
        PATH = 'C:\ChromeDriver\chromedriver.exe'
        driver = webdriver.Chrome(PATH)
        driver.get(links)

        page_html = driver.page_source
        page_soup = soup(page_html, "html.parser")
        sleep(1)
        table_element = page_soup.find("table", {"class": "fund"})
        information = table_element.p.text

        driver.quit()

    except Exception as e:

        information = 'Please login to Technion website to see more information'
        driver.quit()

    if len(information) == 0 or len(information) == 1:
        information = 'Please login to Technion website to see more information'

    return information


def get_calls_num(_url):

    """
       Method to scrape and return the calls number from Technion website
       :param : _url
       :return: calls number
       """

    calls_number = 0

    try:

        #PATH = '/Users/najeh/chromedriver'
        PATH = 'C:\ChromeDriver\chromedriver.exe'
        driver = webdriver.Chrome(PATH)
        driver.get(_url)

        page_html = driver.page_source
        page_soup = soup(page_html, "html.parser")

        number_element = page_soup.find_all("span", {"class": "bold"})
        calls_number = int(number_element[1].text)

        driver.quit()

    except Exception as e:
        print(e)

    return calls_number


def get_technion_call_by(tags, first_date, second_date, call_status):

    """
    Method to return all the relevant calls by tags and dates
    :param : tags, date
    :return: related calls
    """

    tags_call = get_technion_call_by_tags(tags)

    dates_call = get_technion_call_by_dates(first_date, second_date)

    result = get_technion_call_intersection(tags_call, dates_call, call_status)

    return result


def get_technion_call_by_tags(tags):

    """
       Method to get all calls with at least one tag from the list of tags.
       :param tags: list of tags
       :return: list of organizations objects
       """
    finalRes = []

    calls = TechnionCalls.objects.all()

    if not tags:
        for call in calls:
            finalRes.append(call)

    else:

        if len(tags) == 1:

            tags = ' '.join(tags)
            index = reload_index('TechnionIndex')
            corpus = NLP_processor([tags], 'Technion')
            res = index[corpus]
            res = process_query_result(res)

            res = [pair for pair in res if pair[1] > 0.2]
            res = sorted(res, key=lambda pair: pair[1], reverse=True)
            temp = []

            for pair in res:
                try:

                    temp.append(MapIdsTechnion.objects.get(indexID=pair[0]))

                except:
                    pass

            res = temp

        else:

            index = reload_index('TechnionIndex')
            temp = []
            res = ''
            for tag in tags:
                corpus = NLP_processor([tag], 'Technion')
                res = index[corpus]
                res = process_query_result(res)

                res = [pair for pair in res if pair[1] > 0.2]
                res = sorted(res, key=lambda pair: pair[1], reverse=True)

                for pair in res:

                    try:
                        temp.append(MapIdsTechnion.objects.get(indexID=pair[0]))
                    except:
                        pass

                res = temp


        for mapId in res:
            finalRes.append(TechnionCalls.objects.get(CallID=mapId.originalID))

    return finalRes


def get_technion_call_by_dates(first_date, second_date):

    """
         Method to return all the calls between dates
         :param : dates
         :return: calls that have deadline between this range
         """

    calls = TechnionCalls.objects.all()

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


def get_technion_call_intersection(tags_call, dates_call, status):

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


def updateTechnion():

    """
       Method to update all the calls, and delete the old ones
       :return: nothing, only changing the data inside the DB
       """

    updated = False
    TechnionCalls1.objects.all().delete()

    _url = 'https://www.trdf.co.il/eng/Current_Calls_for_Proposals.html?fund=allfunds&type=alltypes&ql=0'

    calls_number = get_calls_num(_url)

    if calls_number % 20 == 0:
        pages_number = calls_number // 20

    else:
        pages_number = (calls_number // 20) + 1

    try:

        data = get_calls_data(_url)

        title = data['title']
        field = data['field']
        date = data['date']
        links = data['link']

        for i, item in enumerate(date):
            info = get_call_information(links[i])
            call = TechnionCalls1(CallID=i, deadlineDate=item, organizationName=title[i],
                                 information=info, areaOfResearch=field[i],
                                 link=links[i], open=True)
            call.save()

    except Exception as e:
        print(e)
        updated = False

    try:

        page_content = 20

        while pages_number >= 2:

            if _url[-2:] == '=0':
                _url = _url[:-1]
                new_url = _url + str(page_content)

            else:
                new_url = _url + str(page_content)

            data = get_calls_data(new_url)

            title = data['title']
            field = data['field']
            date = data['date']
            links = data['link']

            latest_id = TechnionCalls1.objects.latest('CallID')
            latest_id_num = latest_id.CallID + 1

            for i, item in enumerate(date):
                info = get_call_information(links[i])

                call = TechnionCalls1(CallID=latest_id_num, deadlineDate=item, organizationName=title[i],
                                     information=info, areaOfResearch=field[i],
                                     link=links[i], open=True)
                call.save()

                latest_id_num += 1

            page_content += 20
            pages_number -= 1

    except Exception as e:
        print(e)
        updated = False

    return updated


def copy_to_original_Technion():

    TechnionCalls.objects.all().delete()
    MapIdsTechnion.objects.all().delete()

    try:
        os.remove('TechnionIndex')
        os.remove('TechnionIndex.0')
        os.remove('Dictionary_Technion')
        print('Deleting Technion Index...')

    except:
        pass

    index = make_index('TechnionIndex', 'Technion')
    print('Building Technion Index...')

    try:
        all_new_calls = TechnionCalls1.objects.all()

        for i, item in enumerate(all_new_calls):

            call = TechnionCalls(CallID=item.CallID, deadlineDate=item.deadlineDate,
                                organizationName=item.organizationName,
                                information=item.information, areaOfResearch=item.areaOfResearch,
                                link=item.link, open=True)
            call.save()

            originalID = i
            indexID = len(index)
            document = get_document_from_technion_call(item.organizationName, item.areaOfResearch, item.information)
            newMap = MapIdsTechnion(originalID=originalID, indexID=indexID)
            newMap.save()
            index = add_document_to_curr_index(index, [document], 'Technion')

    except Exception as e:
        print(e)

    try:
        if not setUpdateTime(technionDate=time.mktime(datetime.now().timetuple())):
            raise

    except Exception as e:
        print(e)
        setUpdateTime(technionDate=time.mktime(datetime.now().timetuple()))
