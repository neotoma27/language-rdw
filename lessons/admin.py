from django.contrib import admin
from .forms import VocabMCQuestionForm
from .models import (Subject, Question, Lesson, VocabWord, VocabMCQuestion, SentenceMCQuestion, WriteSentenceQuestion,
    TranslatePickWordsQuestion, PairsQuestion)


@admin.register(Subject, Question, Lesson, VocabWord, SentenceMCQuestion, WriteSentenceQuestion,
    TranslatePickWordsQuestion, PairsQuestion)
class LessonsAdmin(admin.ModelAdmin):
    pass


@admin.register(VocabMCQuestion)
class VocabMCQuestionAdmin(admin.ModelAdmin):
    filter_horizontal = ['incorrect_answer_options']
    form = VocabMCQuestionForm