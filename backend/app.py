from main import create_app
import os

# retorno de funcion __init__.py
import ipdb
ipdb.set_trace()
app = create_app()

app.app_context().push()

from main import db

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True,port=os.getenv('PORT'))