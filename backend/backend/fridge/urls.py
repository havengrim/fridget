from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, RegisterView, LogoutView, IngredientViewSet

# Create a router for the viewsets
router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet, basename='ingredient')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),  # Include the viewset routes
]
