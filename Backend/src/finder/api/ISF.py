import requests
from ..models import IsfCalls

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup as soup, element

import time

def get_calls_status(_url, click):


    # please change this PATH to open chromedriver from your device
    PATH = '/Users/najeh/chromedriver'
    driver = webdriver.Chrome(PATH)
    driver.get(_url)
    status, inst_type, num_partners, period, budget, general_info, deadline, reg_deadline, sub_deadline= '', '', '', '', '', '', '', '', ''
    try:
        english = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.LINK_TEXT, "English"))
        )
        english.click()
        time.sleep(1)

        prg = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.LINK_TEXT, click))
        )
        prg.click()
        time.sleep(1)
        page_html = driver.page_source
        page_soup = soup(page_html, "html.parser")

        # Get a list of names, we don't need it now
        # panels = page_soup.find_all("h4", {"class": "panel-title"})
        #
        # for item in panels:
        #     name.append(item.a.a.text)


        grant_tbl = page_soup.find_all("div", {"class": "grantInfoCell"})

        for item in grant_tbl:
            if item.h3.text == "Current status":
                status = item.p.text
            if item.h3.text == "Institute types":
                inst_type = item.p.text
            if item.h3.text == "Number of partners":
                num_partners = item.p.text
            if item.h3.text == "Grant period":
                period = item.p.text
            if item.h3.text == "Grant Budget":
                budget = item.p.text

        try:
            submission_tools = page_soup.find_all("span", {"class": "newlines"})
            deadline = submission_tools[0].text.strip()
            reg_deadline = 'Closed for registration'
            sub_deadline = 'Closed for submission'
        except:
            submission_tools = page_soup.find("div", {"class": "toolInfo"})
            reg_deadline = submission_tools.p.span.text
            submission_tools = submission_tools.find_all("span", {"class": ""})
            sub_deadline = submission_tools[1].text
            deadline = "Open for submission"

        about = page_soup.find("div", {"class": "grantdataText"})
        text_clean = about.div.p.text[:-1]
        general_info = text_clean

        time.sleep(1)

    except Exception as e:
        print(e)
        time.sleep(5)

    driver.quit()

    return status, inst_type, num_partners, period, budget, general_info, deadline, reg_deadline, sub_deadline

