from rest_framework import serializers
from lessons.models import (QuestionBase, Lesson, VocabMCQuestion, SentenceMCQuestion, WriteSentenceQuestion, TranslatePickWordsQuestion,
    PairsQuestion)


class QuestionBaseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = QuestionBase
        fields = ['id', 'subjects']

class LessonSerializer(serializers.HyperlinkedModelSerializer):
    questions = serializers.HyperlinkedRelatedField(many=True, view_name='question-detail', read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'lesson_name', 'subjects', 'questions']

class VocabMCQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model = VocabMCQuestion
        fields = ['id', 'subjects', 'vocab_word', 'correct_answer', 'incorrect_answer_options']

class SentenceMCQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=SentenceMCQuestion
        fields = ['id', 'subjects', 'native_language_sentence', 'correct_answer', 'incorrect_answer_options']

class WriteSentenceQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=WriteSentenceQuestion
        fields = ['id', 'subjects', 'native_language_sentence', 'correct_answer']

class TranslatePickWordsQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=TranslatePickWordsQuestion
        fields = ['id', 'subjects', 'native_language_sentence', 'correct_answer', 'incorrect_words']

class PairsQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=PairsQuestion
        fields = ['id', 'subjects', 'mixed', 'word_pairs']