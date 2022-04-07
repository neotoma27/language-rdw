from django.test import TestCase
from lessons.models import (Subject, QuestionBase, Lesson, VocabMCQuestion, SentenceMCQuestion,
    WriteSentenceQuestion, TranslatePickWordsQuestion, PairsQuestion)


class TestModels(TestCase):
    def test_questionbase_has_subjects(self):
        question = WriteSentenceQuestion.objects.create(native_language_sentence="Hello", correct_answer="Hola")
        greetings = Subject.objects.create(name="Greetings")
        greetings2 = Subject.objects.create(name="Greetings2")
        question.subjects.set([greetings, greetings2])
        self.assertEqual(question.subjects.count(), 2)

    def test_lesson_has_subjects(self):
        lesson = Lesson.objects.create(lesson_name="Greetings")
        greetings = Subject.objects.create(name="Greetings")
        greetings2 = Subject.objects.create(name="Greetings2")
        lesson.subjects.set([greetings, greetings2])
        self.assertEqual(lesson.subjects.count(), 2)

    def test_lesson_has_questions(self):
        lesson = Lesson.objects.create(lesson_name="Greetings")
        question1 = WriteSentenceQuestion.objects.create(native_language_sentence="Hello", correct_answer="Hola")
        question2 = WriteSentenceQuestion.objects.create(native_language_sentence="What's up?", correct_answer="¿Qué tal?")
        lesson.questions.set([question1, question2])
        self.assertEqual(lesson.questions.count(), 2)