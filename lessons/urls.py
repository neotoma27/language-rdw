from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'lessons', views.LessonViewSet)
router.register(r'questions', views.QuestionBaseViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]