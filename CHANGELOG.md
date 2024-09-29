# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Status: [Development]

## [0.1.0] - 2024-09-17

### Added

- Create all frontend views using bootstrap (draft)

## [0.0.4] - 2024-07-09

### Fixed

- Correct all answers (return) in case of failure. Must return a json (object) to easly being managed in the front end.

### Known Issues

- Refator the book-rent-user relationship in the database. It doesn't make sense that the book has a field quantity and is very complicated to sync the rents with the field and the users.
- When make get filtering by valoration, in book resource, it doesn't sort it, just return it normally.
- ~~Correct all answers (return) in case of failure. Must return a json (object) to easly being managed in the front end.~~
- In the register (auth/register) field, it shouldn't be possible to self assign the role. So it take the default value and then is chaged by some admin or administrator role user.
- Admin and users can read the password (hashed) of any user. This is very bad :v
- A deleted user can still make requests with the token, which doesn't make any sense.

## [0.0.3] - 2024-05-30

### Added

- Add functionality to send mail to registered users

### Known Issues

- Refator the book-rent-user relationship in the database. It doesn't make sense that the book has a field quantity and is very complicated to sync the rents with the field and the users.
- When make get filtering by valoration, in book resource, it doesn't sort it, just return it normally.
- Correct all answers (return) in case of failure. Must return a json (object) to easly being managed in the front end.
- In the register (auth/register) field, it shouldn't be possible to self assign the role. So it take the default value and then is chaged by some admin or administrator role user.
- Admin and users can read the password (hashed) of any user. This is very bad :v
- A deleted user can still make requests with the token, which doesn't make any sense.

### To do

- Add rent json to auto-fill the database
- Add logic to avoid sending mails to the fake data loaded in the database

## [0.0.2] - 2024-05-23

### Added

- Necesary requirements for password encryption
- env variables

### Changed

- Add a to_json_no_book in book model, to return just the necesary information when make a get request.

### Deleted

- Delete some filters in book model, as they weren't nesesary.

### Fixed

- When make a get in book resource the book isn't showed again in the valoration.

### Known Issues

- Refator the book-rent-user relationship in the database. It doesn't make sense that the book has a field quantity and is very complicated to sync the rents with the field and the users.
- When make get filtering by valoration, in book resource, it doesn't sort it, just return it normally.
- Correct all answers (return) in case of failure. Must return a json (object) to easly being managed in the front end.
- In the register (auth/register) field, it shouldn't be possible to self assign the role. So it take the default value and then is chaged by some admin or administrator role user.
- Admin and users can read the password (hashed) of any user. This is very bad :v
- A deleted user can still make requests with the token, which doesn't make any sense.

### To do

- Add rent json to auto-fill the database

## [0.0.1] - 2024-05-09

### Added

- This changelog

### Fixed

- Correct the error when return to_json_complete in rent model

### Known Issues

- Must correct the filtering column in user, book and valoration files
- Change the to_json_complete when the request is get in book resource
