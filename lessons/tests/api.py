from rest_framework.test import APIRequestFactory, APITestCase
from rest_framework import status
from lessons.models import (Subject, QuestionBase, Lesson, VocabMCQuestion, SentenceMCQuestion,
    WriteSentenceQuestion, TranslatePickWordsQuestion, PairsQuestion)
from django.urls import include, path, reverse
from lessons.views import LessonViewSet, QuestionBaseViewSet, SubjectViewSet, VocabMCQuestionViewSet

class SubjectTests(APITestCase):
    def test_create_subject(self):
        url = reverse('subject-list')
        data = {'name': 'People'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Subject.objects.count(), 1)
        self.assertEqual(Subject.objects.get().name, 'People')

class VocabMCQuestionTests(APITestCase):
    def test_create_question(self):
        subjectListUrl = reverse('subject-list')
        data = {'name': 'Animals'}
        response = self.client.post(subjectListUrl, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        questionListUrl = reverse('vocabmcquestion-list')
        data = {
            'subjects': [reverse('subject-detail', args=['Animals'])],
            'correct_answer': 'El mono',
            'incorrect_answer_options': {
                'options': [
                    'El perro',
                    'El gato',
                    'La vaca'
                ]
            },
            'vocab_word': 'the monkey'
        }
        response = self.client.post(questionListUrl, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(VocabMCQuestion.objects.count(), 1)
        self.assertEqual(QuestionBase.objects.count(), 1)
        expectedData = {
            'url': reverse('vocabmcquestion-detail', args=[1]),
            'id': 1
        }
        expectedData.update(data.copy())
        # print(response.data)
        # print(expectedData)
        self.assertEqual(response.data, expectedData)
        #testing that the question shows up as a QuestionBase instance
        questionBaseResponse = self.client.get('api/questions/1/')
        expectedData.update({'url': reverse('vocabmcquestion-detail', args=[1])})
        self.assertEqual(questionBaseResponse.data, expectedData)

class LessonTests(APITestCase):
    def test_create_lesson(self):
        #first create one subject instance and two question instances
        subjectListUrl = reverse('subject-list')
        data = {'name': 'Animals'}
        response = self.client.post(subjectListUrl, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        questionListUrl = reverse('vocabmcquestion-list')
        animalsSubjectUrl = reverse('subject-detail', args=['Animals'])
        data = {
            'subjects': [animalsSubjectUrl],
            'correct_answer': 'El mono',
            'incorrect_answer_options': {
                'options': [
                    'El perro',
                    'El gato',
                    'La vaca'
                ]
            },
            'vocab_word': 'the monkey'
        }
        response = self.client.post(questionListUrl, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = {
            'subjects': [animalsSubjectUrl],
            'correct_answer': 'El perro',
            'incorrect_answer_options': {
                'options': [
                    'El mono',
                    'El gato',
                    'La vaca'
                ]
            },
            'vocab_word': 'the dog'
        }
        response = self.client.post(questionListUrl, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        #then test a lesson POST request
        lessonListUrl = reverse('lesson-list')
        data = {
            'lesson_name': 'Animals 1',
            'subjects': [animalsSubjectUrl],
            'questions': [
                reverse('vocabmcquestion-detail', args=[1]),
                reverse('vocabmcquestion-detail', args=[2])
            ]
        }
        response = self.client.post(lessonListUrl, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lesson.objects.count(), 1)
        lesson = self.client.get('api/lessons/1/')
        self.assertEqual(lesson.subjects.count(), 1)
        self.assertEqual(lesson.questions.count(), 2)

# class GetFullURLTests(APITestCase):
#     def test_subject_get_full_URL(self):


# class SubjectPostTest(APITestCase):
#     def setUp(self):
#         factory = APIRequestFactory()
#         request = factory.post('/api/subjects/', {'name': 'People'}, format='json')

#     def test_details(self):
#         request = self.factory.get('/api/subjects/People')
        # request.


# class TestLessonAPI(APITestCase):
#     def test_fetch_lessons_list(self):
#         response = self.client.post(reverse("contact_create"), data=data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#         self.assertEqual(Contact.objects.count(), 1)
