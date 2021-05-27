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


def get_calls(_url):

    field, link, title, date = [], [], [], []

    try:

        PATH = '/Users/najeh/chromedriver'
        driver = webdriver.Chrome(PATH)
        driver.get(_url)

        page_html = driver.page_source
        page_soup = soup(page_html, "html.parser")


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
            date.append(item.text.strip())


    except Exception as e:
        print(e)

    return title, date, field, link

def get_call_information(links):

    get_client = Request(links, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'})

    page_html = req(get_client).read()
    page_soup = soup(page_html, "html.parser")

    table_element = page_soup.find("table", {"class": "fund"})
    information = table_element.p.text

    return information


