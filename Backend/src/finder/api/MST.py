import requests
#from ..models import IsfCalls
from google_trans_new import google_translator
from selenium import webdriver
from bs4 import BeautifulSoup as soup, element
import re
import time


def get_calls(_url):


    # please change this PATH to open chromedriver from your device
    PATH = '/Users/najeh/chromedriver'
    driver = webdriver.Chrome(PATH)
    driver.get(_url)
    translator = google_translator()

    call_name, link, deadline, about = [], [], [], []
    try:

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
            deadline.append(temp1)

        for item in call_info:

            if len(item.text) == 1:
                about.append("No Info Is Available")
            else:
                temp = item.text.replace("\r\n","")
                temp1 = re.sub("-", "", temp)
               # about.append( translator.translate(temp1.strip()))
                about.append(temp1.strip())

        time.sleep(1)


    except Exception as e:
        print("ERROR", e)
        time.sleep(1)

    list_of_data = list(zip(call_name, link, deadline, about))
    
    return list_of_data

