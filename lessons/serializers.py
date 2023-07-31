from rest_framework import serializers
from lessons.models import (Subject, Question, Lesson, VocabWord, VocabMCQuestion, Sentence, SentenceMCQuestion,
                            WriteSentenceQuestion, TranslatePickWordsQuestion, PairsQuestion)


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


class VocabWordSerializer(serializers.HyperlinkedModelSerializer):
    subjects = serializers.HyperlinkedRelatedField(
        many=True, view_name='subject-detail', queryset=Subject.objects.all())

    class Meta:
        model = VocabWord
        fields = ['url', 'id', 'target_language_word', 'native_language_word', 'subjects']


class VocabMCQuestionSerializer(serializers.ModelSerializer):
    incorrect_answer_options = VocabWordSerializer(many=True)
    vocab_word = VocabWordSerializer(many=False)
    
    class Meta:
        model = VocabMCQuestion
        fields = ['url', 'id', 'incorrect_answer_options', 'vocab_word']


class SentenceSerializer(serializers.HyperlinkedModelSerializer):
    subjects = serializers.HyperlinkedRelatedField(
        many=True, view_name='subject-detail', queryset=Subject.objects.all())

    class Meta:
        model = Sentence
        fields = ['url', 'id', 'target_language_sentence', 'native_language_sentence', 'subjects']


class SentenceMCQuestionSerializer(serializers.ModelSerializer):
    incorrect_answer_options = SentenceSerializer(many=True)
    correct_sentence = SentenceSerializer(many=False)
    
    class Meta:
        model = SentenceMCQuestion
        fields = ['url', 'id', 'incorrect_answer_options', 'correct_sentence']


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