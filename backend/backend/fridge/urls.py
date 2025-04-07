from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, RegisterView, LogoutView, IngredientViewSet, DeleteIngredientByCategoryIndex
from .views import AIRecipeView
# Create a router for the viewsets
router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet, basename='ingredient')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('ingredients/delete_by_index/', DeleteIngredientByCategoryIndex.as_view(), name='delete_by_index'),
    path("recipes/ai/", AIRecipeView.as_view(), name="ai-recipes"),
    path('', include(router.urls)),  # Include the viewset routes
]
