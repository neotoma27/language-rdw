from django.shortcuts import render
from lessons.models import QuestionBase, Lesson
from lessons.serializers import QuestionBaseSerializer, LessonSerializer
from rest_framework import viewsets

class LessonViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class QuestionBaseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = QuestionBase.objects.all()
    serializer_class = QuestionBaseSerializer