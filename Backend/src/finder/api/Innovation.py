import requests
from ..models import IsfCalls

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
            dates.append('Closed')

        else:
            dates.append(sub_date)

    except :
        dates = []
        dates.append('Closed')
        dates.append('Closed')


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
            area = 'N/A'

    except :
        area = 'N/A'

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

