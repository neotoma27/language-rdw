from django.contrib import admin
from .forms import VocabMCQuestionForm, SentenceMCQuestionForm
from .models import (Subject, Question, Lesson, VocabWord, VocabMCQuestion, Sentence, SentenceMCQuestion, WriteSentenceQuestion,
    TranslatePickWordsQuestion, PairsQuestion)


@admin.register(Subject, Question, Lesson, VocabWord, Sentence, WriteSentenceQuestion,
    TranslatePickWordsQuestion, PairsQuestion)
class LessonsAdmin(admin.ModelAdmin):
    pass


@admin.register(VocabMCQuestion)
class VocabMCQuestionAdmin(admin.ModelAdmin):
    filter_horizontal = ['incorrect_answer_options']
    form = VocabMCQuestionForm


@admin.register(SentenceMCQuestion)
class SentenceMCQuestionAdmin(admin.ModelAdmin):
    filter_horizontal = ['incorrect_answer_options']
    form = SentenceMCQuestionForm