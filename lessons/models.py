from django.db import models

class Lesson(models.Model):
    subject = models.CharField(max_length=30)