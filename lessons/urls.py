from django.urls import path
from . import views

urlpatterns = [
    path('api/lesson/', views.LessonListCreate.as_view() ),
]