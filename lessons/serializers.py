from rest_framework import serializers
from lessons.models import Lesson, VocabMCQuestion, VocabMCChoice


class VocabMCChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = VocabMCChoice
        fields = ('id', 'word_choice')

class VocabMCQuestionSerializer(serializers.ModelSerializer):
    choices = VocabMCChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = VocabMCQuestion
        fields = ('id', 'lesson', 'vocab_word', 'correct_choice', 'question_number')
        depth = 1

class LessonSerializer(serializers.ModelSerializer):
    questions = VocabMCQuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'subject', 'questions']
        depth = 2