from rest_framework import serializers
from lessons.models import (Subject, Question, Lesson, VocabMCQuestion, SentenceMCQuestion, WriteSentenceQuestion, TranslatePickWordsQuestion,
    PairsQuestion)


# class ChildQuestionRelatedField(serializers.RelatedField):
#     """
#     A custom field to use for the `child_question` generic relationship.
#     """

#     def to_representation(self, value):
#         return value.url

class SubjectSerializer(serializers.HyperlinkedModelSerializer):
    # url = serializers.HyperlinkedIdentityField(view_name="subject-detail")
    class Meta:
        model = Subject
        fields = ['url', 'name']


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    question_type = serializers.IntegerField

    class Meta:
        model = Question
        fields = ['url', 'id', 'question_type']


class LessonSerializer(serializers.HyperlinkedModelSerializer):
    questions = serializers.HyperlinkedRelatedField(
        many=True, view_name='question-detail', queryset=Question.objects.all())

    class Meta:
        model = Lesson
        fields = ['url', 'id', 'lesson_name', 'subjects', 'questions']


class VocabMCQuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = VocabMCQuestion
        fields = ['url', 'id', 'vocab_word', 'correct_answer', 'incorrect_answer_options']
        # extra_kwargs = {'incorrect_answer_options': {'binary': True}}


class SentenceMCQuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model=SentenceMCQuestion
        fields = ['url', 'id', 'native_language_sentence', 'correct_answer', 'incorrect_answer_options']


class WriteSentenceQuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model=WriteSentenceQuestion
        fields = ['url', 'id', 'native_language_sentence', 'correct_answer']


class TranslatePickWordsQuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model=TranslatePickWordsQuestion
        fields = ['url', 'id', 'native_language_sentence', 'correct_answer', 'incorrect_words']


class PairsQuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model=PairsQuestion
        fields = ['url', 'id', 'mixed', 'word_pairs']