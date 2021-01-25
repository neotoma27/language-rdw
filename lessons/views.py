from django.shortcuts import render
from .models import Lesson
from .serializers import LessonSerializer
from rest_framework import generics

class LessonListCreate(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
