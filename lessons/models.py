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


class Question(models.Model):
    @property
    def question_type(self):
        if hasattr(self, "vocabmcquestion"):
            return 1
        elif hasattr(self, "sentencemcquestion"):
            return 2
        elif hasattr(self, "writesentencequestion"):
            return 3
        elif hasattr(self, "translatepickwordsquestion"):
            return 4
        elif hasattr(self, "pairsquestion"):
            return 5
        

class Lesson(models.Model):
    lesson_name = models.CharField(max_length=80, unique=True)
    subjects = models.ManyToManyField(Subject)
    questions = models.ManyToManyField(Question)
    def __str__(self):
        return self.lesson_name
# class MCQuestionBase(QuestionBase):
    # correct_answer = models.CharField(max_length=150)
    # incorrect_answer_options = models.JSONField(validators=[validate_mc_JSON])
#     class Meta:
#         abstract = True


class VocabWord(models.Model):
    target_language_word = models.CharField(max_length=200)
    native_language_word = models.CharField(max_length=200)
    subjects = models.ManyToManyField(Subject)
    def __str__(self):
        return self.target_language_word


class VocabMCQuestion(Question):
    incorrect_answer_options = models.ManyToManyField(
        VocabWord,
        related_name="question_this_is_incorrect_option_for",
        help_text='Question should have three Incorrect Answer Options')
    vocab_word = models.ForeignKey(VocabWord, on_delete=models.CASCADE, related_name="question_this_is_correct_answer_for")
    def __str__(self):
        return str(self.vocab_word)
    

class Sentence(models.Model):
    target_language_sentence = models.CharField(max_length=800)
    native_language_sentence = models.CharField(max_length=800)
    subjects = models.ManyToManyField(Subject)
    def __str__(self):
        return self.target_language_sentence


class SentenceMCQuestion(Question):
    incorrect_answer_options = models.ManyToManyField(
        Sentence,
        related_name="question_this_is_incorrect_option_for",
        help_text='Question should have three Incorrect Answer Options')
    correct_sentence = models.ForeignKey(Sentence, on_delete=models.CASCADE, related_name="question_this_is_correct_answer_for")
    def __str__(self):
        return str(self.correct_sentence)


class WriteSentenceQuestion(Question):
    native_language_sentence = models.CharField(max_length=150)
    correct_answer = models.CharField(max_length=150)
    def __str__(self):
        return self.native_language_sentence


class TranslatePickWordsQuestion(Question):
    native_language_sentence = models.CharField(max_length=150)
    correct_answer = models.CharField(max_length=150)
    incorrect_words = models.JSONField(validators=[validate_pick_words_JSON])
    def __str__(self):
        return self.native_language_sentence


class PairsQuestion(Question):
    mixed = models.BooleanField(default=False)
    word_pairs = models.JSONField(validators=[validate_word_pairs_JSON])