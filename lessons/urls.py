from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter
from lessons import views
from lessons.views import LessonViewSet, VocabMCQuestionDetail, VocabMCChoiceList
from rest_framework import renderers

router = DefaultRouter()
router.register(r'lessons', views.LessonViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('vocabmcquestions/<int:pk>/', views.VocabMCQuestionDetail.as_view()),
    path('vocabmcchoices/', views.VocabMCChoiceList.as_view()),
]