from django.urls import path, include
from rest_framework.routers import DefaultRouter
from lessons import views

router = DefaultRouter()
router.register(r'lessons', views.LessonViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'vocabwords', views.VocabWordViewSet)
router.register(r'vocabmcquestions', views.VocabMCQuestionViewSet)
router.register(r'sentences', views.SentenceViewSet)
router.register(r'sentencemcquestions', views.SentenceMCQuestionViewSet)
router.register(r'writesentencequestions', views.WriteSentenceQuestionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]