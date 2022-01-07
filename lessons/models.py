from django.db import models
from django.core.exceptions import ValidationError
import jsonschema

MC_OPTIONS_JSON_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Incorrect Options for Multiple-Choice Question",
    "description": "Array of three strings for the incorrect answers for a multiple choice question",
    "type": "object",
    "properties": {
        "options": {
            "description": "The answer options",
            "type": "array",
            "items": {
                "type": "string"
            },
            "minItems": 3,
            "maxItems": 3,
            "uniqueItems": True
        }
    },
    "required": [ "options" ]
}

PICK_WORDS_INCORRECT_JSON_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Incorrect Word Options for Pick-Words Translation Question",
    "description": "Array of two to nine strings for the incorrect words that can be chosen for a pick-words translation question",
    "type": "object",
    "properties": {
        "words": {
            "description": "Incorrect words that can be chosen",
            "type": "array",
            "items": {
                "type": "string"
            },
            "minItems": 2,
            "maxItems": 9,
            "uniqueItems": True
        }
    },
    "required": [ "words" ]
}

WORD_PAIRS_JSON_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "Word Pairs for Pairs Question",
    "description": "Two arrays, named targetLanguageWords and firstLanguageWords, with five strings each, representing pairs of vocabulary words to be matched in a pairs question",
    "type": "object",
    "properties": {
        "targetLanguageWords": {
            "description": "Five target-language vocabulary words",
            "type": "array",
            "items": {
                "type": "string"
            },
            "minItems": 5,
            "maxItems": 5,
            "uniqueItems": True
        },
        "firstLanguageWords": {
            "description": "The first-language translations of the five target-language vocabulary words",
            "type": "array",
            "items": {
                "type": "string"
            },
            "minItems": 5,
            "maxItems": 5,
            "uniqueItems": True
        }
    },
    "required": [ "targetLanguageWords", "firstLanguageWords" ]
}

MC_OPTIONS_VALIDATION_ERROR_MESSAGE = ('incorrect_answer_options must be a JSON object with one member whose name is '
    'options and whose value is an array of three strings')

PICK_WORDS_INCORRECT_VALIDATION_ERROR_MESSAGE = ('incorrect_words must be a JSON object with one member whose name is '
    'words and whose value is an array of two to nine strings')

WORD_PAIRS_VALIDATION_ERROR_MESSAGE = ('word_pairs must be a JSON object with two members whose names are targetLanguageWords and '
    'firstLanguageWords, and the value for each must be an array with five strings')

def validate_JSON(value, schema, error_message):
    try:
        jsonschema.validate(value, schema)
    except jsonschema.exceptions.ValidationError:
        raise ValidationError(error_message)

def validate_mc_JSON(options):
    validate_JSON(options, MC_OPTIONS_JSON_SCHEMA, MC_OPTIONS_VALIDATION_ERROR_MESSAGE)

def validate_pick_words_JSON(options):
    validate_JSON(options, PICK_WORDS_INCORRECT_JSON_SCHEMA, PICK_WORDS_INCORRECT_VALIDATION_ERROR_MESSAGE)

def validate_word_pairs_JSON(options):
    validate_JSON(options, WORD_PAIRS_JSON_SCHEMA, WORD_PAIRS_VALIDATION_ERROR_MESSAGE)

class Subject(models.Model):
    name = models.CharField(max_length=70, primary_key=True)

class QuestionBase(models.Model):
    difficulty = models.SmallIntegerField

    # class QuestionLanguage(models.TextChoices):
    #     FRENCH = 'FRE'
    #     SPANISH = 'ESP'
    #     CHINESE = 'ZHO'

    # question_language = models.CharField(
    #     max_length=3,
    #     choices=QuestionLanguage.choices,
    #     blank=False,
    # )
    
    subjects = models.ManyToManyField(Subject)

class Lesson(models.Model):
    lesson_ID = models.CharField(max_length=50, primary_key=True)
    lesson_name = models.CharField(max_length=80, unique=True)
    subjects = models.ManyToManyField(Subject)
    questions = models.ManyToManyField(QuestionBase)

class MCQuestionBase(QuestionBase):
    correct_answer = models.CharField(max_length=150)
    incorrect_answer_options = models.JSONField(validators=[validate_mc_JSON])

    class Meta:
        abstract = True

class VocabMCQuestion(MCQuestionBase):
    vocab_word = models.CharField(max_length=80)

class SentenceMCQuestion(MCQuestionBase):
    native_language_sentence = models.CharField(max_length=150)

class WriteSentenceQuestion(QuestionBase):
    native_language_sentence = models.CharField(max_length=150)
    correct_answer = models.CharField(max_length=150)

class TranslatePickWordsQuestion(QuestionBase):
    native_language_sentence = models.CharField(max_length=150)
    correct_answer = models.CharField(max_length=150)
    incorrect_words = models.JSONField(validators=[validate_pick_words_JSON])

class PairsQuestion(QuestionBase):
    mixed = models.BooleanField(default=False)
    word_pairs = models.JSONField(validators=[validate_word_pairs_JSON])