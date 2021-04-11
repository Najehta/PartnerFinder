import requests
from google_trans_new import google_translator
from selenium import webdriver
from bs4 import BeautifulSoup as soup, element
import re
import time as t
from datetime import datetime


def get_calls(_url):


    # please change this PATH to open chromedriver from your device
    PATH = '/Users/najeh/chromedriver'
    driver = webdriver.Chrome(PATH)
    driver.get(_url)
    translator = google_translator()

    call_name, link, deadline, about = [], [], [], []
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
            word_trans = translator.translate(item.a.text.strip())
            word_trans = re.sub(pattern, "call", word_trans)
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
            else:
                deadline.append(temp1 + ' (Open)')


        for item in call_info:

            if len(item.text) == 1:
                about.append("Not Available")
            else:
                temp = item.text.replace("\r\n","")
                temp1 = re.sub("-", "", temp)
                about.append( translator.translate(temp1.strip()))
                about.append(temp1.strip())

        t.sleep(1)


    except Exception as e:
        print("ERROR", e)
        t.sleep(1)

    t.sleep(1)
    driver.quit()
    list_of_data = list(zip(call_name, link, deadline, about))

    return list_of_data

def get_calls_num(_url):

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

