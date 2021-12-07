from rest_framework import serializers
from lessons.models import (QuestionBase, Lesson, VocabMCQuestion, SentenceMCQuestion, WriteSentenceQuestion, TranslatePickWordsQuestion,
    PairsQuestion)


class QuestionBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBase
        fields = ['id', 'difficulty', 'question_language', 'subjects']

class LessonSerializer(serializers.ModelSerializer):
    questions = QuestionBaseSerializer(many=True, read_only=True) #not sure if it's ok to just use the parent class here?

    class Meta:
        model = Lesson
        fields = ['id', 'subjects', 'questions']
        depth = 1

class VocabMCQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model = VocabMCQuestion
        fields = ['id', 'difficulty', 'question_language', 'subjects', 'vocab_word', 'correct_answer', 'incorrect_answer_options']

class SentenceMCQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=SentenceMCQuestion
        fields = ['id', 'difficulty', 'question_language', 'subjects', 'native_language_sentence', 'correct_answer',
            'incorrect_answer_options']

class WriteSentenceQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=WriteSentenceQuestion
        fields = ['id', 'difficulty', 'question_language', 'subjects', 'native_language_sentence', 'correct_answer']

class TranslatePickWordsQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=TranslatePickWordsQuestion
        fields = ['id', 'difficulty', 'question_language', 'subjects', 'native_language_sentence', 'correct_answer',
            'incorrect_words']

class PairsQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=PairsQuestion
        fields = ['id', 'difficulty', 'question_language', 'subjects', 'mixed', 'word_pairs']