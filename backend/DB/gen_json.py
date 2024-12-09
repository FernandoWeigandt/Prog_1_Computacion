from dotenv import load_dotenv
from faker import Faker
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
import random, json, os

def generate_test_data(
    author_count: int = 26, 
    book_count: int = 70, 
    book_copy_count: int = 120,
    comment_count: int = 100, 
    notification_count: int = 50, 
    rent_count: int = 60, 
    user_count: int = 80
) -> None:
    """Generates test data for the database.

    Args:
        user_count (int, optional): The number of users to generate. Defaults to 30.
        book_count (int, optional): The number of books to generate. Defaults to 40.
        comment_count (int, optional): The number of comments to generate. Defaults to 50.
        notification_count (int, optional): The number of notifications to generate. Defaults to 50.
        rent_count (int, optional): The number of rents to generate. Defaults to 50.
        author_count (int, optional): The number of authors to generate. Defaults to 20.
        book_copy_count (int, optional): The number of book copies to generate. Defaults to 50.

    Returns:
        None
    """
    if rent_count > book_copy_count:
        raise ValueError("El número de rentas no puede ser mayor que el número de copias de libros.")
    max_combinations = user_count * book_count
    if comment_count > max_combinations:
        raise ValueError("El número de comentarios solicitados excede el número máximo de combinaciones únicas posibles.")

    load_dotenv()
    start_date = datetime.strptime('2020-01-01', '%Y-%m-%d').date()
    today_date = date.today()
    test_path = os.getenv('DATABASE_PATH') + "/test-data/"

    if not os.path.exists(test_path):
        os.makedirs(test_path)

    fake = Faker()

    ############################################
    #               AUTHORS                    #
    ############################################

    authors = []
    for _ in range(author_count):
        author = {
            "name": fake.first_name(),
            "lastname": fake.last_name(),
        }
        authors.append(author)
    with open(f"{test_path}/authors.json", "w", encoding="utf-8") as json_file:
        json.dump(authors, json_file, ensure_ascii=False, indent=4)

    ############################################
    #               BOOK_COPIES                #
    ############################################


    book_copies = []
    for _ in range(book_copy_count):
        book_copy = {
            "book_id": random.randint(1, book_count),  
        }
        book_copies.append(book_copy)
    with open(f"{test_path}/book_copies.json", "w", encoding="utf-8") as json_file:
        json.dump(book_copies, json_file, ensure_ascii=False, indent=4)

    ############################################
    #               BOOKS                      #
    ############################################

    books = []
    for _ in range(book_count):
        n = random.randint(0, 3)
        book = {
            "title": fake.sentence(nb_words=4),
            "gender": random.choice(["Narrativo", "Lírico", "Dramático", "Didáctico", "Poético", "Otro"]),
            "description": fake.paragraph(nb_sentences=5),
            "image": "book_cover_" + str(random.randint(0, 9)) + ".jpg",
            "authors": [random.randint(1, author_count) for _ in range(n)]
        }
        books.append(book)
    with open(f"{test_path}/books.json", "w", encoding="utf-8") as json_file:
        json.dump(books, json_file, ensure_ascii=False, indent=4)

    ############################################
    #                COMMENTS                  #
    ############################################

    comments = []
    unique_combinations = set()
    while len(comments) < comment_count:
        user_id = random.randint(1, user_count)
        book_id = random.randint(1, book_count)
        if (user_id, book_id) not in unique_combinations:
            unique_combinations.add((user_id, book_id))
            comment = {
                "body": fake.text(max_nb_chars=200),
                "rate": random.randint(1, 5),
                "date": str(fake.date_between_dates(start_date, today_date)),
                "book_id": book_id,
                "user_id": user_id,
            }
            comments.append(comment)
    with open(f"{test_path}/comments.json", "w", encoding="utf-8") as json_file:
        json.dump(comments, json_file, ensure_ascii=False, indent=4)

    ############################################
    #                NOTIFICATIONS             #
    ############################################

    notifications = []
    for _ in range(notification_count): 
        notification = {
            "title": fake.sentence(nb_words=4),
            "body": fake.text(max_nb_chars=200),
            "date": str(fake.date_between_dates(start_date, today_date)),
            "category": random.choice(['warning', 'danger', 'info', 'info', 'info']),
            "user_id": random.randint(1, user_count),
            "note": fake.text(max_nb_chars=15),
            "read": random.choice([True, False])
        }
        notifications.append(notification)
    with open(f"{test_path}/notifications.json", "w", encoding="utf-8") as json_file:
        json.dump(notifications, json_file, ensure_ascii=False, indent=4)

    ############################################
    #                RENTS                     #
    ############################################

    rents = []
    available_book_copy_ids = list(range(1, book_copy_count + 1))
    random.shuffle(available_book_copy_ids)
    for _ in range(rent_count):
        book_copy_id = available_book_copy_ids.pop()
        init_date = fake.date_between_dates(start_date, today_date)
        expiration_date = fake.date_between_dates(init_date, today_date + relativedelta(days=100))
        rent = {
            "user_id": random.randint(1, user_count),
            "book_copy_id": book_copy_id,
            "init_date": str(init_date),
            "expiration_date": str(expiration_date),
        }
        rents.append(rent)
    with open(f"{test_path}/rents.json", "w", encoding="utf-8") as json_file:
        json.dump(rents, json_file, ensure_ascii=False, indent=4)

    ############################################
    #                USERS                     #
    ############################################

    used_mails = set()
    users = [
        {
            "name": "Juan",
            "lastname": "Garcia",
            "mail": "juan.garcia@mail.example",
            "phone": 588895040,
            "role": "user",
            "passwd": "aB03lmk4"
        },
        {
            "name": "Osvaldo",
            "lastname": "Hernandez",
            "mail": "osvaldo.hernandez@mail.example",
            "phone": 285671232,
            "role": "librarian",
            "passwd": "sJAS26gx"
        },
        {
            "name": "Adrian",
            "lastname": "Jimenez",
            "mail": "adrian.jimenez@mail.example",
            "phone": 658984844,
            "role": "admin",
            "alias": "adrian",
            "passwd": "jK5x1Cfm"
        },
        {
            "name": "Hernesto",
            "lastname": "Guevara",
            "mail": "hernesto.guevara@mail.example",
            "phone": 285671231,
            "passwd": "tX2vBrQw"
        }
    ]
    used_mails.add("juan.garcia@mail.example")
    used_mails.add("osvaldo.hernandez@mail.example")
    used_mails.add("adrian.jimenez@mail.example")
    used_mails.add("hernesto.guevara@mail.example")
    for _ in range(user_count-4):
        mail = fake.email()
        while mail in used_mails:
            mail = fake.email()
        used_mails.add(mail)
        user = {
            "name": fake.first_name(),
            "lastname": fake.last_name(),
            "mail": mail,
            "phone": fake.random_number(digits=fake.random_int(min=9, max=15), fix_len=True),
            "role": random.choice(['admin', 'librarian', 'user', 'user', 'user', 'user', 'pending']),
            "alias": fake.user_name(),
            "passwd": fake.password()
        }
        users.append(user)
    with open(f"{test_path}/users.json", "w", encoding="utf-8") as json_file:
        json.dump(users, json_file, ensure_ascii=False, indent=4)

    print("[+] Datos de prueba generados con exito")

if __name__ == "__main__":
    generate_test_data()
