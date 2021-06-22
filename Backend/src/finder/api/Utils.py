from googletrans import Translator
import collections
import smtplib
import ssl
import os
from decouple import config
from .EU import *
from ..models import UpdateTime


def translate_data(data):
    """
    function to translate non english data in object into english
    :param data: object
    :return: translated object
    """

    translator = Translator()
    for key in data:
        if type(data[key]) == str:
            try:
                data[key] = translator.translate(data[key]).text
            except:
                continue
    return data


class Graph:
    """
    class to define undirected unweighted graph
    """

    def __init__(self):
        self.graph = collections.defaultdict(set)
        self.vertices = set()

    def add(self, u, v):
        self.vertices.add(u)
        self.vertices.add(v)
        self.graph[u].add(v)
        self.graph[v].add(u)


def send_mail(receiver_email, message):
    """
    function to send mail to a specific email address with a specific message
    :param receiver_email: the receiver email address
    :param message: the message to send.
    :return:
    """

    sender_mail = config('EMAIL')
    password = config('PASSWORD')
    ssl_port = 465
    smtp_server = 'smtp.gmail.com'

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL(smtp_server, ssl_port, context=context) as server:
            server.login(sender_mail, password)
            server.sendmail(sender_mail, receiver_email, message.as_string())
    except Exception as e:
        print("ERROR", e)


def deleteOldIndexAndReplace():
    os.remove("B2MATCH_upcoming_Index")
    os.remove("B2MATCH_upcoming_Index.0")
    os.rename("B2MATCH_upcoming_Index_temp", "B2MATCH_upcoming_Index")
    os.rename("B2MATCH_upcoming_Index_temp.0", "B2MATCH_upcoming_Index.0")


def destroy_and_rename(old_index_name, new_index_name):
    try:
        os.remove(old_index_name)
        os.remove(old_index_name + ".0")
    except:
        pass
    os.rename(new_index_name, old_index_name)
    os.rename(new_index_name + '.0', old_index_name + '.0')


def setUpdateTime(euDate=None, technionDate=None, isfDate=None, mstDate=None, innovationDate=None, bsfDate=None ):
    """
    function to update the last update date
    :param euDate: EU last update
    :param technionDate: Technion last update
    :param isfDate: ISF last update
    :param mstDate: MST last update
    :param innovationDate: Innovation last update
    :param bsfDate: BSF last update
    :return: True/False
    """

    if not technionDate and not euDate and not isfDate and not mstDate and not innovationDate and not bsfDate:
        return False

    if euDate:
        euDate = int(euDate)
    if technionDate:
        technionDate = int(technionDate)
    if isfDate:
        isfDate = int(isfDate)
    if mstDate:
        mstDate = int(mstDate)
    if innovationDate:
        innovationDate = int(innovationDate)
    if bsfDate:
        bsfDate = int(bsfDate)

    try:
        UpdateTime.objects.get(ID=1)
        if euDate:
            UpdateTime.objects.filter(ID=1).update(eu_update=euDate)
        if technionDate:
            UpdateTime.objects.filter(ID=1).update(technion_update=technionDate)
        if isfDate:
            UpdateTime.objects.filter(ID=1).update(isf_update=isfDate)
        if bsfDate:
            UpdateTime.objects.filter(ID=1).update(bsf_update=bsfDate)
        if mstDate:
            UpdateTime.objects.filter(ID=1).update(mst_update=mstDate)
        if innovationDate:
            UpdateTime.objects.filter(ID=1).update(innovation_update=innovationDate)

    except:
        Update_Time = UpdateTime(eu_update=euDate,
                                 technion_update=technionDate,
                                 isf_update=isfDate,
                                 bsf_update=bsfDate,
                                 mst_update=mstDate,
                                 innovation_update=innovationDate,
                                 ID=1)
        Update_Time.save()

    return True