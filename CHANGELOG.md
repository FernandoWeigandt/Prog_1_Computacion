# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Status: [Development]

## [0.0.2] - 2024-05-09

### Changed

- Add a to_json_no_book in book model, to return just the necesary information when make a get request.

### Delete

- Delete some filters in book model, as they weren't nesesary.

### Fixed

- When make a get in book resource with the to_json_complete method, in the valoration field, the book is showed again. (a quick fix is to return the to_json method, but it doesn't show the valorations, and the filter do not have sence)

### Known Issues

- Refator the book-rent-user relationship in the database. It doesn't make sense that the book has a field quantity and is very complicated to sync the rents with the field and the users.
- When make get filtering by valoration, in book resource, it doesn't sort it, just return it normally.

## [0.0.1] - 2024-05-09

### Added

- This changelog

### Fixed

- Correct the error when return to_json_complete in rent model

### Known Issues

- Must correct the filtering column in user, book and valoration files
- Change the to_json_complete when the request is get in book resource
