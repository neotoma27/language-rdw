from django.shortcuts import render
from lessons.models import Lesson, VocabMCQuestion, VocabMCChoice
from lessons.serializers import LessonSerializer, VocabMCQuestionSerializer, VocabMCChoiceSerializer
from rest_framework import generics, viewsets

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class VocabMCQuestionDetail(generics.RetrieveAPIView):
    queryset = VocabMCQuestion.objects.all()
    serializer_class = LessonSerializer

class VocabMCChoiceList(generics.ListAPIView):
    queryset = VocabMCChoice.objects.all()
    serializer_class = VocabMCChoiceSerializer