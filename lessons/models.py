from django.db import models

class Lesson(models.Model):
    subject = models.CharField(max_length=30)

class VocabMCQuestion(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='question_set')
    vocab_word = models.CharField(max_length=40)
    correct_choice = models.PositiveIntegerField()
    question_number = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if self.pk == None:
            self.question_number = VocabMCQuestion.objects \
                .filter(lesson=self.lesson) \
                .aggregate(max_number=Max("question_number")) \
                .get("max_number",0) + 1

        super().save(*args, **kwargs)

class VocabMCChoice(models.Model):
    question = models.ForeignKey(VocabMCQuestion, on_delete=models.CASCADE, related_name='choice_set')
    word_choice = models.CharField(max_length=40)
    choice_number = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if self.pk == None:
            self.choice_number = VocabMCChoice.objects \
                .filter(question=self.question) \
                .aggregate(max_number=Max("choice_number")) \
                .get("max_number",0) + 1

        super().save(*args, **kwargs)