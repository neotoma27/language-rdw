from django.shortcuts import render
from lessons.models import QuestionBase, Lesson, Subject
from lessons.serializers import QuestionBaseSerializer, LessonSerializer, SubjectSerializer
from rest_framework import viewsets


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class QuestionBaseViewSet(viewsets.ModelViewSet):
    queryset = QuestionBase.objects.all()
    serializer_class = QuestionBaseSerializer

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer