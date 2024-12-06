#!/bin/bash

make_post() {
    JSON=$1
    URL=$2
    cat "$JSON" | jq -c '.[]' | while read object; do
        curl -X POST --location "$URL" -H 'Content-Type: application/json' -d "$object" 0&>/dev/null
    done
}

fill_database() {
    USERS_JSON="./DB/test-data/users.json"
    AUTHORS_JSON="./DB/test-data/authors.json"
    BOOKS_JSON="./DB/test-data/books.json"
    COMMENTS_JSON="./DB/test-data/comments.json"
    BOOK_COPIES_JSON="./DB/test-data/book_copies.json"
    RENTS_JSON="./DB/test-data/rents.json"
    NOTIFICATIONS_JSON="./DB/test-data/notifications.json"

    API_PORT=$(grep " PORT " .env | awk '{ print $4 }' | sed "s/'//g")

    URL_API="http://127.0.0.1:$API_PORT"
    
    echo "[+] Espera 8 segundos para la carga de datos mientras inicia el server..."
    sleep 8
    
    # Fill users table with auth and mail sender
    # make_post "$USERS_JSON" "$URL_API/auth/register"
    # Fill users table with normal post method
    make_post "$USERS_JSON" "$URL_API/users"
    # Fill author table
    make_post "$AUTHORS_JSON" "$URL_API/authors"
    # Fill books table
    make_post "$BOOKS_JSON" "$URL_API/books"
    # Fill valorations table
    make_post "$COMMENTS_JSON" "$URL_API/comments"
    # Fill book_copies table
    make_post "$BOOK_COPIES_JSON" "$URL_API/copies"
    # Fill rents table
    make_post "$RENTS_JSON" "$URL_API/rents"
    # Fill notifications table
    make_post "$NOTIFICATIONS_JSON" "$URL_API/notifications"
}

yes_no_validate() {
    message="$1"
    default="$2"
    while true; do
        read -p "$message" input
        input=$(echo "$input" | tr '[:upper:]' '[:lower:]')
        if [[ -z "$input" ]]; then
            input="$default"
            break
        elif [[ "$input" == "s" || "$input" == "si" ]]; then
            input="s"
            break
        elif [[ "$input" == "n" || "$input" == "no" ]]; then
            input="n"
            break
        else
            echo "[?] Invalid Input"
        fi
    done
    echo $input
}

start_app() {
    source $(find . -type f -name activate | grep .)
    if [ $? -eq "0" ] ; then
        python3 app.py
    else
        echo '[!] No se ha encontrado un entorno virtual!'
        exit 1
    fi
}

echo "[+] Iniciando..."
database=$(find . -type f -name database.db | grep .)
if [ $? -eq "0" ] ; then
    echo "[+] Se ha encontrado una base de datos en \"$database\" continuando..."
else
    echo "[+] No se ha encontrado base de datos, creando una nueva..."
fi
if [ $(yes_no_validate "[!] ¿Desea crear una y llenarla con datos de prueba? [s/N]: " "n") == "s" ]; then
    echo "[+] Iniciando la app y llenando la base de datos..."
    (fill_database) &
    start_app
else
    echo "[+] Iniciando la app..."
    start_app
fi