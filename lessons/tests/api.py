from rest_framework.test import APITestCase
from rest_framework import status
from lessons.models import (Subject, QuestionBase, Lesson, VocabMCQuestion, SentenceMCQuestion,
    WriteSentenceQuestion, TranslatePickWordsQuestion, PairsQuestion)
from django.urls import reverse

class TestLessonAPI(APITestCase):
    def test_fetch_lessons_list(self):
        response = self.client.post(reverse("contact_create"), data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contact.objects.count(), 1)
