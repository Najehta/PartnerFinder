import requests
from ..models import InnovationCalls, MapIdsINNOVATION

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


from bs4 import BeautifulSoup as soup, element
from urllib.request import urlopen as req
from urllib.request import Request
from time import sleep
import re
import time as t
from datetime import datetime
from .QueryProcess import *

def get_calls_org(_url):

    # open the connection with the url
    # This will avoid mod_security on the website, to avoid been blocked
    get_client = Request(_url,headers= {'User-Agent': 'Mozilla/5.0'})

    # grab the page html
    page_html = req(get_client).read()

    # html parsing
    page_soup = soup(page_html, "html.parser")

    td_title = page_soup.find_all("td", {"class": "views-field views-field-title"})

    name, link = [],[]
    for item in td_title:
        temp_string = item.a.text.strip()
        name.append(temp_string)
        link.append(get_call_link(temp_string, _url))

    # open google chrome driver to scroll down on the website to grab more calls
    PATH = '/Users/najeh/chromedriver'
    driver = webdriver.Chrome(PATH)
    driver.get(_url)
    click = "Next"
    click_isExisted = True

    while click_isExisted:
        try:
            t.sleep(1)
            driver.execute_script("scrollBy(0,800)")
            t.sleep(1)

            next_page = WebDriverWait(driver, 2).until(
            EC.presence_of_element_located((By.PARTIAL_LINK_TEXT, click))
            )
            next_page.click()
            t.sleep(2)

            page_html = driver.page_source
            page_soup = soup(page_html, "html.parser")

            td_title = page_soup.find_all("td", {"class": "views-field views-field-title"})

            curr_url = driver.current_url
            for item in td_title:
                temp_string = item.a.text.strip()
                name.append(temp_string)
                link.append(get_call_link(temp_string, curr_url))

        except Exception as e:
            click_isExisted = False
            t.sleep(1)


    driver.quit()
    name_link = list(zip(name,link))

    return name_link


def get_call_date(_url) :

    # This will avoid mod_security on the website, to avoid been blocked
    get_client = Request(_url, headers={'User-Agent': 'Mozilla/5.0'})

    # grab the page html
    page_html = req(get_client).read()
    # get_client.close()
    # html parsing
    page_soup = soup(page_html, "html.parser")
    dates = []
    try:

        td_reg_date = page_soup.find("time", {"class": "datetime"})
        reg_date = td_reg_date.text.strip()
        dates.append(reg_date)

    except :
        dates.append('Closed')


    try:

        td_sub_date = page_soup.find_all("time", {"class": "datetime"})

        if len(td_sub_date) == 2:
            sub_date = td_sub_date[1].text.strip()

        elif len(td_sub_date) == 3:
            sub_date = td_sub_date[2].text.strip()
        else:
            sub_date = 'Closed'

        d1, m1, y1 = [int(x) for x in sub_date.split('/')]
        b1 = datetime(y1, m1, d1)

        today = datetime.today()
        d1 = today.strftime("%d/%m/%Y")
        d2, m2, y2 = [int(x) for x in d1.split('/')]
        b2 = datetime(y2, m2, d2)

        if b1 < b2:
            dates.append(sub_date + ' (Closed)')
            deadline_date = None
            dates.append(deadline_date)

        else:
            dates.append(sub_date+ ' (Open)')
            deadline_date = datetime.strptime(sub_date, "%d/%m/%Y")
            dates.append(deadline_date)

    except :
        dates = []
        deadline_date = None
        dates.append('Closed')
        dates.append('Closed')
        dates.append(deadline_date)

    return dates


def get_call_info(_url):

    # This will avoid mod_security on the website, to avoid been blocked
    get_client = Request(_url, headers={'User-Agent': 'Mozilla/5.0'})

    # grab the page html
    page_html = req(get_client).read()
    # get_client.close()
    # html parsing
    page_soup = soup(page_html, "html.parser")

    try:
        field = page_soup.find('div', {"class": 'clearfix text-formatted field field--name-field-introduction field--type-text-long field--label-above'})

        if field.h2.text == 'Summary' or field is not None:
            field2 = field.find('div', {"class": 'field__item'})
            summary = field2.p.text
        else:
            summary = 'N/A'

    except:

        summary = 'N/A'


    return summary


def get_call_field(_url):

    # This will avoid mod_security on the website, to avoid been blocked
    get_client = Request(_url, headers={'User-Agent': 'Mozilla/5.0'})

    # grab the page html
    page_html = req(get_client).read()
    # get_client.close()
    # html parsing
    page_soup = soup(page_html, "html.parser")

    try:

        field = page_soup.find('div', {"class": 'field field--name-field-relevant-technologies field--type-string field--label-inline'})

        if field.h2.text == 'Relevant Technologies' or field is not None:
            field2 = field.find('div', {"class": 'field__item'})
            area = field2.text

        else:
            area = 'Not Available'

    except :
        area = 'Not Available'

    return area


def get_call_link(name, _url):

    PATH = '/Users/najeh/chromedriver'
    driver = webdriver.Chrome(PATH)
    driver.get(_url)
    click = name
    link = ''

    try:
        t.sleep(1)
        driver.execute_script("scrollBy(0,800)")
        t.sleep(1)

        next_page = WebDriverWait(driver, 2).until(
            EC.presence_of_element_located((By.LINK_TEXT, click))
        )
        next_page.click()
        t.sleep(2)
        link = driver.current_url
        driver.quit()

    except Exception as e:
        print(e)
        t.sleep(1)

    return link


def get_Innovation_call_by(tags, first_date, second_date):

    tags_call = get_Innovation_call_by_tags(tags)
    # print("Related call to "+tags+" is: ", tags_call)
    dates_call = get_Innovation_call_by_dates(first_date, second_date)
    # print("Related call to " + first_date + " and "+second_date+ "is: ", dates_call)

    result = get_Innovation_call_intersection(tags_call, dates_call)

    return result


def get_Innovation_call_by_tags(tags):
    """
       function to get all calls with at least one tag from the list of tags.
       :param tags: list of tags
       :return: list of organizations objects
       """

    tags = ''.join(tags)
    index = reload_index('InnovationIndex')
    corpus = NLP_processor([tags], 'INNOVATION')
    res = index[corpus]
    res = process_query_result(res)

    res = [pair for pair in res if pair[1] > 0.3]
    res = sorted(res, key=lambda pair: pair[1], reverse=True)
    temp = []

    for pair in res:
        try:
            temp.append(MapIdsINNOVATION.objects.get(indexID=pair[0]))
        except:
            pass
    res = temp

    finalRes = []
    for mapId in res:
        finalRes.append(InnovationCalls.objects.get(CallID=mapId.originalID))

    return finalRes

def get_Innovation_call_by_dates(first_date, second_date):

    calls = InnovationCalls.objects.all()

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


def get_Innovation_call_intersection(tags_call, dates_call):

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