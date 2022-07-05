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
        # question_expected_full_url = self.client.get('api/vocabmcquestions/1/get_full_url').data
        # subject_expected_full_url = self.client.get('api/subjects/Animals/get_full_url').data
        question_expected_full_url = self.client.get(reverse('vocabmcquestion-get-full-url', args=[1])).data
        subject_expected_full_url = self.client.get(reverse('subject-get-full-url', args=['Animals'])).data
        expected_data = data.copy()
        expected_data.update(
            {
                'url': question_expected_full_url,
                'id': 1,
                'subjects': [subject_expected_full_url]
            }
        )
        self.assertEqual(response.data, expected_data)
        # self.assertEqual(dict(response.data), expected_data)

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
        self.assertEqual(VocabMCQuestion.objects.count(), 2)
        self.assertEqual(QuestionBase.objects.count(), 2)
        print([reverse('questionbase-detail', args=[1]), reverse('questionbase-detail', args=[2])])
        #then test a lesson POST request
        lessonListUrl = reverse('lesson-list')
        data = {
            'lesson_name': 'Animals 1',
            'subjects': [animalsSubjectUrl],
            'questions': [
                reverse('questionbase-detail', args=[1]),
                reverse('questionbase-detail', args=[2])
            ]
        }
        response = self.client.post(lessonListUrl, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lesson.objects.count(), 1)
        # self.assertEqual(Lesson.objects.get(pk=1).questions.count(), 2)
        print(Lesson.objects.get(pk=1).questions)
        lesson_expected_full_url = self.client.get(reverse('lesson-get-full-url', args=[1])).data
        subject_expected_full_url = self.client.get(reverse('subject-get-full-url', args=['Animals'])).data
        question1_expected_full_url = self.client.get(reverse('questionbase-get-full-url', args=[1])).data
        question2_expected_full_url = self.client.get(reverse('questionbase-get-full-url', args=[2])).data
        expected_data = data.copy()
        expected_data.update(
            {
                'url': lesson_expected_full_url,
                'id': 1,
                'subjects': [subject_expected_full_url],
                'questions': [question1_expected_full_url, question2_expected_full_url]
            }
        )
        print(response.data)
        print(expected_data)
        print(type(response.data))
        print(type(expected_data))
        self.assertEqual(response.data, expected_data)
        # self.assertEqual(dict(response.data), expected_data)

class GetFullURLTests(APITestCase):
    def test_subject_get_full_URL(self):
        url = reverse('subject-list')
        data = {'name': 'People'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        get_full_url_response = self.client.get(reverse('subject-get-full-url', args=['People']))
        self.assertEqual(get_full_url_response.data, 'http://testserver/api/subjects/People/')