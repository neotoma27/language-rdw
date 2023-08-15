# Setup

Project should come with a sample database that already has some questions and lessons.

# Running the App

Start the server:
\$ python3 manage.py runserver
Go to local domain in a web browser.

# Using the Admin Site

## Create Admin User

Run the following to create an admin user:
\$ python3 manage.py createsuperuser
Enter a username, password, and email.
Open /admin/ on your local domain in a web browser, and log in.

## Subjects

First, create at least one Subject.

## Questions

Only Multiple-Choice Vocabulary Questions and Multiple-Choice Sentence Questions are currently working.

### Multiple-Choice Vocabulary Questions

Create at least four Vocab Words, and then use them to make a Vocab MC Question. Each Vocab MC Question has one correct answer and three incorrect answers.

### Multiple-Choice Sentence Questions

Create at least four Sentences, and then use them to make a Sentence MC Question. Each Sentence MC Question has one correct answer and three incorrect answers.

## Lessons

Create a lesson and choose at least one Subject and at least one Question for it.
