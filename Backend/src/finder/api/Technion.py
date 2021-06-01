import os
from datetime import datetime
#from ..models import MapIdsBSF, bsfCalls
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
from selenium import webdriver
#from .QueryProcess import *


def get_calls_data(_url):

    field, link, title, date = [], [], [], []
    data = {}

    try:

        PATH = '/Users/najeh/chromedriver'
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


    information = ''

    try:
        PATH = '/Users/najeh/chromedriver'
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

    calls_number = 0

    try:

        PATH = '/Users/najeh/chromedriver'
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


# _url = 'https://www.trdf.co.il/eng/Current_Calls_for_Proposals.html?fund=allfunds&type=alltypes&ql=0'
# print(get_calls_data(_url))