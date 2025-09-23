# COP4331 Fall 2025 Contact Manager Project
# Group 23

## Database

There are two tables: Users and Contacts

- The Users table contains the following columns:
    - `ID` INT NOT NULL AUTO_INCREMENT (Primary Key)
    - `FirstName` VARCHAR(50) NOT NULL DEFAULT ''
    - `LastName` VARCHAR(50) NOT NULL DEFAULT ''
    - `Login` VARCHAR(50) NOT NULL DEFAULT '' , 
    - `Password` VARCHAR(50) NOT NULL DEFAULT ''
- The Contacts table contains the following columns:
    - `ID` INT NOT NULL AUTO_INCREMENT (Primary Key)
    - `FirstName` VARCHAR(50) NOT NULL DEFAULT ''
    - `LastName` VARCHAR(50) NOT NULL DEFAULT ''
    - `Phone` VARCHAR(50) NOT NULL DEFAULT ''
    - `Email` VARCHAR(50) NOT NULL DEFAULT ''
    - `UserID` INT NOT NULL DEFAULT '0' (Foreign Key to User ID)

## API

hello
## Front-End
Hi