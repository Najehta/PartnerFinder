import os
from email.mime.text import MIMEText
import pandas
import smtplib, ssl
from email.mime.multipart import MIMEMultipart
from decouple import config
from dotenv import read_dotenv

def email_processing(receiver_email, message):

    """
    Method to send emails to a specific email address with a specific message
    :param receiver_email: the receiver email address
    :param message: the message to send.
    :return: nothing
    """

    read_dotenv()
    sender_mail = os.getenv('USERID')
    password = os.getenv('PASSWORD')
    ssl_port = 465
    smtp_server = 'smtp.gmail.com'

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(smtp_server, ssl_port, context=context) as server:

            server.login(sender_mail, password)
            server.sendmail(sender_mail, receiver_email, message.as_string())

    except Exception as e:
        print("ERROR while sending email!")
        print(e)