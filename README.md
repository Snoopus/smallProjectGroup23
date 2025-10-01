# COP4331 Fall 2025 Contact Manager Project
# Group 23

This is a full-stack web application utilizing a LAMP stack.

Contact info can be created per user account, private to that user only. Those contacts can be searched over using partial matching, updated, and more. The user accounts can also be updated to change username/password. 

# Setup
Place this repository into the /var/www/html folder of an Apache server.

A `.env` file needs to be created like `.env.example` with the credentials for the MySQL user.

## MySQL Database
There are two tables: Users and Contacts

- The Users table contains the following columns:
    - `ID`          INT         NOT NULL AUTO_INCREMENT (Primary Key)
    - `FirstName`   VARCHAR(50) NOT NULL DEFAULT ''
    - `LastName`    VARCHAR(50) NOT NULL DEFAULT ''
    - `Login`       VARCHAR(50) NOT NULL DEFAULT '' 
    - `Password`    VARCHAR(50) NOT NULL DEFAULT ''
    - `UUID`        VARCHAR(50) NOT NULL DEFAULT ''

- The Contacts table contains the following columns:
    - `ID`          INT         NOT NULL AUTO_INCREMENT (Primary Key)
    - `FirstName`   VARCHAR(50) NOT NULL DEFAULT ''
    - `LastName`    VARCHAR(50) NOT NULL DEFAULT ''
    - `Phone`       VARCHAR(50) NOT NULL DEFAULT ''
    - `Email`       VARCHAR(50) NOT NULL DEFAULT ''
    - `UserUUID`    VARCHAR(50) NOT NULL DEFAULT '' (Foreign Key to Users' `UUID`)
    - `UUID`        VARCHAR(50) NOT NULL DEFAULT '' 

All columns of Users will be populated.

All columns except Phone and Email of Contacts are guaranteed to be populated. 

## API
Further API documentation can be found at https://app.swaggerhub.com/apis/group232/Narwhal_Ltd_API/1.1.0

Both requests and responses use application/json. All endpoints are written in PHP. 

The specific keys to use are documented in the link above and in each endpoint's `LAMPAPI` file header comment.
The "error" response key is always present. It specifies what error happened in the backend logic, if any. 

CRUD endpoints:
- Login.php
- Register.php
- AddContact.php
- SearchContact.php
- EditContact.php
- DeleteContact.php

Account endpoints:
- DeleteUser.php
- EditPassword.php
- EditUsername.php

## HTML/JS Front-End
This front-end makes use of Bootstrap, a library that automatically styles and formats away typical CSS. 
Please consult https://getbootstrap.com/docs/5.3/getting-started/introduction/ if you wish to learn more.

HTML Files
- index.html (Landing  Page)
- register.html (Registration Page)
- login.html (login Page)
- search.html(Search Page)
- addContacts.html (Add contacts Page)
- account.html (User account Page)

JavaScript Files
- code.js (Main JS file)
- login.js (Login functions)
- register.js (Register functions)
- search.js (Search functions)
- addContact.js (Add Contact functions)
- accountPage.js (User Account functions)
- md5.js (Hashing function)

CSS Files
- styles.css (Styling for special cases)
- bootstrap.min.css (Main styling file)

And the absolutely beautiful background art was commissioned from Athena Pinheiro (@athenapenguind)!