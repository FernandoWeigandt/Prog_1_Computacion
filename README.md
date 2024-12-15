# Library Web Page

## About this proyect

This proyect is a fork of the real Library Web proyect for a signature of the university. I decided to continue expanding the functionality outside the main proyect to have a deep understanding on the protocols used inside the proyect itself.

This proyect consist on two parts:
- Backend
- Frontend

The backend is an API-RESTful implemented in python using flask and the fronted is written using Angular. The libraries used and deep description of the proyect is in the wiki section. The main idea of the proyect was to make a complete system for a library. In this library wouldn't be digital copies of books, instead, just physical copies, and users can login, make request for getting books and see all the library catalog. Then, it should contain also librarians and administrators to manage the library itself.

The API (located at backend directory) will be responsible of comunicating the frontend of the App with the database following REST principles. 

In the other hand, the frontend was made using Angular with bootstrap trying to follow all responsive design principles.

## Instalation and execution

### Instalation

#### Backend

There are two ways of installing and executing the scritps located in the backend folder. If you want to install and get the python venv activated, you should execute this command:

```bash
cd backend && source install.sh
```

If you only want to create the venv and let the venv deactivated:

```bash
cd backend && ./install.sh
```

#### Frontend

To install all packages needed to run the frontend you must have `npm` installed and install [Angular](https://angular.dev/installation).

Then, located in the root directory of the proyect run:

```bash
cd frontend
npm install
```

And `npm` will install all dependencies and libraries for you.

### Execution

Once installed all libraries needed, you can continue on running the proyect.

#### Backend

To execute the backend, you should create a .env file following the .env-example file. 

```bash
cd backend
cp .env-example .env
```
Make sure to install all python dependencies before executing. The `install.sh` script will do it for you.

This script will create a python venv and install required packages for you. But if you want to do it manually by yourself, just create and activate a python venv and install all required packages (listed in requirements.txt file). You can follow this example:

```bash
# In the backend directory
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Then to run the backend:

```bash
./boot.sh
```

The advantage of the boot script is that it will offer you to fill up the database with testing data. However, if you just want to run it:

```bash
# with the python venv activated run
python3 app.py
```

This will only create an empty database and make visible all the resources of the API in the specified port.

#### Frontend

```bash
ng serve -o
```

### Frontend design

The prototype was made in figma (`deprecated`). To see it click [here](https://www.figma.com/design/cISJEx3uRimDIfdLR5N5YQ/Librer%C3%ADa?node-id=0-1&t=orSXJa2clBBefjAs-1) 