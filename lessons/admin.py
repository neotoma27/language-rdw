from django.contrib import admin
from .models import (Subject, Question, Lesson, VocabMCQuestion, SentenceMCQuestion, WriteSentenceQuestion,
    TranslatePickWordsQuestion, PairsQuestion)

@admin.register(Subject, Question, Lesson, VocabMCQuestion, SentenceMCQuestion, WriteSentenceQuestion,
    TranslatePickWordsQuestion, PairsQuestion)
class LessonsAdmin(admin.ModelAdmin):
    pass