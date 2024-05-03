# Grupo F

## Instalation and execution

### Instalation

There are two ways of installing and executing the scritps located in the backend folder. If you want to install and get the python venv activated, you should execute this command:

```bash
cd backend && source install.sh
```

If you only want to create the venv and let the venv deactivated:

```bash
cd backend && ./install.sh
```
### Execution

To execute flask, you should create a .env file following the .env-example file. Replace the 'Port' with the port you want to use. Then if you want to run (located in the root directory of the proyect):

```bash
cd backend && ./boot.sh
```

### Database diagram

![database](./backend/DB/database(dark).png)
