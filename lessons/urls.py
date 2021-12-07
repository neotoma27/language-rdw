from django.urls import path, include
from rest_framework.routers import DefaultRouter
from lessons import views

router = DefaultRouter()
router.register(r'lessons', views.LessonViewSet)
router.register(r'questions', views.QuestionBaseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]