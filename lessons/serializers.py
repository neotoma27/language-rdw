from rest_framework import serializers
from lessons.models import Lesson, VocabMCQuestion, VocabMCChoice

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ('subject',) #comma is necessary to make it a tuple

class VocabMCQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VocabMCQuestion
        fields = ('lesson', 'first_language_word', 'target_language_word')

class VocabMCChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = VocabMCChoice
        fields = ('question', 'word_choice')