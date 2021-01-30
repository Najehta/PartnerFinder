from email.mime.text import MIMEText
import pandas
from emailCred import emailCred
import smtplib, ssl
from email.mime.multipart import MIMEMultipart


password = emailCred()[1]
port = 465 # for SSL
smtp_server = "smtp.gmail.com"
msg = MIMEMultipart()
msg['from'] = emailCred()[0]
msg['To'] = 'Najeh.tahhan@gmail.com'
msg['Subject'] = "Partner Finder Events"
# name = 'Najeh'
body = "Congratulations {} on first email subscription to our website partnerfinder.jce.ac.il, we will sent you emails about our upcoming events!".format(name)

msg.attach(MIMEText(body, 'plain'))
text = msg.as_string()
context = ssl.create_default_context()
with smtplib.SMTP_SSL(smtp_server, port, context=context) as server:
    server.login(emailCred()[0], password)
    server.sendmail(emailCred()[0], msg['To'], text)

print('Your email has been sent!')
