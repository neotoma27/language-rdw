from django.db import models

class Lesson(models.Model):
    subject = models.CharField(max_length=30)

class VocabMCQuestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='question_set')
    first_language_word = models.CharField(max_length=40)
    target_language_word = models.CharField(max_length=40)

class VocabMCChoice(models.Model):
    question = models.ForeignKey(VocabMCQuestion, on_delete=models.CASCADE, related_name='choice_set')
    word_choice = models.CharField(max_length=40)