from django.contrib import admin
from .models import (Subject, QuestionBase, Lesson, VocabMCQuestion, SentenceMCQuestion, WriteSentenceQuestion,
    TranslatePickWordsQuestion, PairsQuestion)

@admin.register(Subject, QuestionBase, Lesson, VocabMCQuestion, SentenceMCQuestion, WriteSentenceQuestion,
    TranslatePickWordsQuestion, PairsQuestion)
class LessonsAdmin(admin.ModelAdmin):
    pass