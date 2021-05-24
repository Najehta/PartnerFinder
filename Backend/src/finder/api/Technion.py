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

    try:

        PATH = '/Users/najeh/chromedriver'
        driver = webdriver.Chrome(PATH)
        driver.get(_url)

        page_html = driver.page_source
        page_soup = soup(page_html, "html.parser")

        table_element = page_soup.find_all("table", {"class": "team kolkore"})
        print(table_element)


    except Exception as e:
        print(e)


_url = 'https://www.trdf.co.il/eng/Current_Calls_for_Proposals.html?fund=allfunds&type=alltypes&ql=0'
get_calls(_url)