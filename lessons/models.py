from django.db import models
from django.db.models.fields.related import ManyToManyField

class Subject(models.Model):
    pass

class QuestionBase(models.Model):
    difficulty = models.SmallIntegerField

    class QuestionLanguage(models.TextChoices):
        FRENCH = 'FRE'
        SPANISH = 'ESP'
        CHINESE = 'ZHO'

    question_language = models.CharField(
        max_length=3,
        choices=QuestionLanguage.choices,
        blank=False,
    )
    
    subjects = models.ManyToManyField(Subject)

    class Meta:
        abstract = True

class Lesson(models.Model):
    subjects = models.ManyToManyField(Subject)
    questions = models.ManyToManyField(QuestionBase)

class VocabMCQuestion(QuestionBase):
    vocab_word = models.CharField(max_length=40)
    correct_answer = models.CharField(max_length=40)
    incorrect_answer_options = models.JSONField()

class SentenceMCQuestion(QuestionBase):
    native_language_sentence = models.CharField(max_length=100)
    correct_answer = models.CharField(max_length=100)
    incorrect_answer_options = models.JSONField()

class WriteSentenceQuestion(QuestionBase):
    native_language_sentence = models.CharField(max_length=100)
    correct_answer = models.CharField(max_length=100)

class TranslatePickWordsQuestion(QuestionBase):
    native_language_sentence = models.CharField(max_length=100)
    correct_answer = models.CharField(max_length=100)
    word_options = models.JSONField()

class PairsQuestion(QuestionBase):
    mixed = models.BooleanField(default=False)
    word_pairs = models.JSONField()