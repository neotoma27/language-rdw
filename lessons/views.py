from django.shortcuts import render
from lessons.models import Question, Lesson, Subject, VocabWord, VocabMCQuestion, Sentence, SentenceMCQuestion, WriteSentenceQuestion
from lessons.serializers import (QuestionSerializer, LessonSerializer, SubjectSerializer, VocabWordSerializer,
                                 VocabMCQuestionSerializer, SentenceSerializer, SentenceMCQuestionSerializer,
                                 WriteSentenceQuestionSerializer)
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.reverse import reverse


class ModelViewSetWithGetFullURL(viewsets.ModelViewSet):
    @action(detail=True)
    def get_full_url(self, request, pk=None):
        url_name = self.basename + "-detail"
        return Response(reverse(url_name, args=[pk], request=request))


class LessonViewSet(ModelViewSetWithGetFullURL):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer


class QuestionViewSet(ModelViewSetWithGetFullURL):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class SubjectViewSet(ModelViewSetWithGetFullURL):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer


class VocabWordViewSet(ModelViewSetWithGetFullURL):
    queryset = VocabWord.objects.all()
    serializer_class = VocabWordSerializer


class VocabMCQuestionViewSet(ModelViewSetWithGetFullURL):
    queryset = VocabMCQuestion.objects.all()
    serializer_class = VocabMCQuestionSerializer


class SentenceViewSet(ModelViewSetWithGetFullURL):
    queryset = Sentence.objects.all()
    serializer_class = SentenceSerializer


class SentenceMCQuestionViewSet(ModelViewSetWithGetFullURL):
    queryset = SentenceMCQuestion.objects.all()
    serializer_class = SentenceMCQuestionSerializer


class WriteSentenceQuestionViewSet(ModelViewSetWithGetFullURL):
    queryset = WriteSentenceQuestion.objects.all()
    serializer_class = WriteSentenceQuestionSerializer