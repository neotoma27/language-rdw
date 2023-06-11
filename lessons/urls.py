from django.urls import path, include
from rest_framework.routers import DefaultRouter
from lessons import views

router = DefaultRouter()
router.register(r'lessons', views.LessonViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'vocabmcquestions', views.VocabMCQuestionViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]