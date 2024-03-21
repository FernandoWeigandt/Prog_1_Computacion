from main import create_app
import os

# retorno de funcion __init__.py
app = create_app()

app.app_context().push()

if __name__ == '__main__':
    app.run(debug=True,port=os.getenv('PORT'))