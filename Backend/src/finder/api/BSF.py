import requests
from ..models import BsfEvents

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
import re


def get_events_deadline():
    bsf_calender_url = 'https://www.bsf.org.il/calendar/'
    # open the connection with the url
    get_client = req(bsf_calender_url)
    # grab the page html
    page_html = get_client.read()
    get_client.close()
    # html parsing
    page_soup = soup(page_html, "html.parser")

    # grab all the lists that contain the wanted data
    lists_containers = page_soup.find_all("li", {"class": "list-item"})
    # print(lists_containers)
    # number of deadlines that we want to grab
    num_of_deadlines = len(lists_containers)

    # for loop to iterate over the deadlines
    deadline= []

    #event_description = ""
    for container in lists_containers:
        deadline.append(container.h3.text)
        #event_description = event_description + container.div.text

    return deadline


def get_events_details():
    bsf_calender_url = 'https://www.bsf.org.il/calendar/'
    # open the connection with the url
    get_client = req(bsf_calender_url)
    # grab the page html
    page_html = get_client.read()
    get_client.close()
    # html parsing
    page_soup = soup(page_html, "html.parser")

    # grab all the lists that contain the wanted data
    lists_containers = page_soup.find_all("li", {"class": "list-item"})
    # print(lists_containers)
    # number of deadlines that we want to grab
    num_of_deadlines = len(lists_containers)

    # for loop to iterate over the deadlines

    event_details = []
    #event_description = ""
    for container in lists_containers:
        event_details.append(container.div.text)
        #event_description = event_description + container.div.text

    return event_details


def get_field_name():

    event_details = get_events_details()
    field_name = []

    for event in event_details:
        word_search = re.search(r'\b(in)\b', event)
        field_start_index = word_search.start() + 2
        word_search = re.search('[^a-zA-Z\d\s-]', event)
        field_end_index = word_search.start()
        field_name.append(event[field_start_index + 1:field_end_index - 1])


    return field_name


def make_csv_file(lists_containers):
    # open an excel sheet to save the data
    excel_file = "BSF-Events.csv"
    f = open(excel_file, "w")
    file_headers = "Deadline Date, Description\n"
    f.write(file_headers)
    for container in lists_containers:
        deadline = container.h3.text
        description = container.div.text
        f.write(deadline.replace(",", "") + "," + description + "\n")
    f.close()


# The steps below can be summarized in a simple way as Document ->
# Remove stop words -> Find Term Frequency (TF) ->
# Find Inverse Document Frequency (IDF) ->
# Find TF*IDF -> Get top N Keywords.

def word_process(doc):
    # Remove stopwords
    stop_words = set(stopwords.words('english'))

    # Find total words in the document
    total_words = doc.split()
    total_word_length = len(total_words)
  # print("total word length: {}".format(total_word_length))

    # Find the total number of sentences
    total_sentences = tokenize.sent_tokenize(doc)
    total_sent_len = len(total_sentences)
   # print("total sentences length: {} ".format(total_sent_len))

    # Calculate TF for each word
    tf_score = {}
    for each_word in total_words:
        each_word = each_word.replace('.', '')
        if each_word not in stop_words:
            if each_word in tf_score:
                tf_score[each_word] += 1
            else:
                tf_score[each_word] = 1

    # Dividing by total_word_length for each dictionary element
    tf_score.update((x, y / int(total_word_length)) for x, y in tf_score.items())
   # print("tf-score is{}".format(tf_score))

    # Calculate IDF for each word
    idf_score = {}
    for each_word in total_words:
        each_word = each_word.replace('.', '')
        if each_word not in stop_words:
            if each_word in idf_score:
                idf_score[each_word] = check_sent(each_word, total_sentences)
            else:
                idf_score[each_word] = 1

    # Performing a log and divide
    idf_score.update((x, math.log(int(total_sent_len) / y)) for x, y in idf_score.items())

   # print("idf-score is{}".format(idf_score))

    # Calculate TF * IDF
    tf_idf_score = {key: tf_score[key] * idf_score.get(key, 0) for key in tf_score.keys()}
    #print("tf_idf_score is : {}".format(tf_idf_score))

    # Get the top 5 words of significance
   # print("Top 5 words: {}".format(get_top_n(tf_idf_score, 5)))


# Function to check if the word is present in a sentence list
def check_sent(word, sentences):
    final = [all([w in x for w in word]) for x in sentences]
    sent_len = [sentences[i] for i in range(0, len(final)) if final[i]]
    return int(len(sent_len))


# Method to return the top n elements
def get_top_n(dict_elem, n):
    result = dict(sorted(dict_elem.items(), key=itemgetter(1), reverse=True)[:n])
    return result



