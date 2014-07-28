#! /usr/bin/env python
# -*- coding : utf-8 -*-

import os
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from mako.template import Template

from settings import LOGGER_NAME
from settings import FROM
from settings import TO

SMTP_USER = os.getenv('SENDGRID_USER', None)
SMTP_PASSWORD = os.getenv('SENDGRID_PASSWORD', None)

def sendMail(data):
    # Set Logger Object
    logger = logging.getLogger(LOGGER_NAME)

    try:
        # Create message container - the correct MIME type is
        # multipart/alternative.
        msg = MIMEMultipart('alternative')

        msg['Subject'] = 'Top Eatries of Ophio Foodly'
        msg['From'] = FROM
        msg['To'] = ','.join(TO)

        # Create the body of the message (an HTML version).
        mytemplate = Template(filename='mailer/template.html')
        html = mytemplate.render(data=data)

        # Record the MIME types of text/html.
        part = MIMEText(html, 'html')

        # Attach part into message container.
        msg.attach(part)

        # Set SMTP server login ceredentials and send mail
        server = smtplib.SMTP('smtp.sendgrid.net')
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(FROM, TO, msg.as_string())
        server.quit()
        logger.info('Successfully sent the mail')
    except Exception as e:
        logger.exception("Failed to send mail")

def sendIntroMail():
    # Set Logger Object
    logger = logging.getLogger(LOGGER_NAME)
    try:
        # Create message container - the correct MIME type is
        # multipart/alternative.
        msg = MIMEMultipart('alternative')

        msg['Subject'] = 'Welcome in Ophio Foodly'
        msg['From'] = FROM
        msg['To'] = ','.join(TO)

        # Create the body of the message (an HTML version).
        mytemplate = Template(filename='mailer/template2.html')
        html = mytemplate.render()

        # Record the MIME types of text/html.
        part = MIMEText(html, 'html')

        # Attach part into message container.
        msg.attach(part)

        # Set SMTP server login ceredentials and send mail
        server = smtplib.SMTP('smtp.sendgrid.net')
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(FROM, TO, msg.as_string())
        server.quit()
        logger.info('Successfully sent the mail')
    except Exception as e:
        logger.exception("Failed to send intro mail")
