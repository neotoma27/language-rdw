from rest_framework import serializers
from lessons.models import (Subject, QuestionBase, Lesson, VocabMCQuestion, SentenceMCQuestion, WriteSentenceQuestion, TranslatePickWordsQuestion,
    PairsQuestion)


class SubjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Subject
        fields = ['url', 'id', 'name']

class QuestionBaseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = QuestionBase
        fields = ['url', 'id', 'subjects']

class LessonSerializer(serializers.HyperlinkedModelSerializer):
    questions = serializers.HyperlinkedRelatedField(many=True, view_name='question-detail', read_only=True)

    class Meta:
        model = Lesson
        fields = ['url', 'id', 'lesson_name', 'subjects', 'questions']

class VocabMCQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model = VocabMCQuestion
        fields = ['url', 'id', 'subjects', 'vocab_word', 'correct_answer', 'incorrect_answer_options']

class SentenceMCQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=SentenceMCQuestion
        fields = ['url', 'id', 'subjects', 'native_language_sentence', 'correct_answer', 'incorrect_answer_options']

class WriteSentenceQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=WriteSentenceQuestion
        fields = ['url', 'id', 'subjects', 'native_language_sentence', 'correct_answer']

class TranslatePickWordsQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=TranslatePickWordsQuestion
        fields = ['url', 'id', 'subjects', 'native_language_sentence', 'correct_answer', 'incorrect_words']

class PairsQuestionSerializer(QuestionBaseSerializer):
    class Meta:
        model=PairsQuestion
        fields = ['url', 'id', 'subjects', 'mixed', 'word_pairs']