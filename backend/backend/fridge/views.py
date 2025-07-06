from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Ingredient
from .serializers import IngredientSerializer
from rest_framework.authentication import TokenAuthentication
from rest_framework import viewsets, permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from transformers import pipeline
from dotenv import load_dotenv
import os
import logging
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from transformers import AutoModelForCausalLM, AutoTokenizer
from .models import CachedRecipe
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "message": "Login successful"})
        return Response({"error": "Invalid credentials"}, status=400)
    

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        first_name = request.data.get("first_name")
        password = request.data.get("password")
        allergies = request.data.get("allergies", [])
        spiciness = request.data.get("spiciness")
        meat_consumption = request.data.get("meat_consumption")
        fish_consumption = request.data.get("fish_consumption")
        vegetable_consumption = request.data.get("vegetable_consumption")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=400)

        user = User.objects.create_user(username=username, first_name=first_name, password=password)

        user.profile.allergies = allergies
        user.profile.spiciness = spiciness
        user.profile.meat_consumption = meat_consumption
        user.profile.fish_consumption = fish_consumption
        user.profile.vegetable_consumption = vegetable_consumption
        user.profile.save()

        token = Token.objects.create(user=user)

        return Response({"message": "User registered successfully", "token": token.key})
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()  # Deletes the user's token
            return Response({"message": "Logged out successfully"})
        except Exception:
            return Response({"error": "Logout failed"}, status=400)


class IngredientViewSet(viewsets.ModelViewSet):
    serializer_class = IngredientSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Ingredient.objects.filter(user=self.request.user)  # Only fetch user's ingredients

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class DeleteIngredientByCategoryIndex(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        category = request.data.get("category")
        index = request.data.get("index")

        if category is None or index is None:
            return Response({"error": "Category and index are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter ingredients by category and user
        ingredients = Ingredient.objects.filter(user=request.user, category=category).order_by("id")

        # Get ingredient by index
        try:
            ingredient_to_delete = ingredients[index]
        except IndexError:
            return Response({"error": "Ingredient not found at the given index."}, status=status.HTTP_404_NOT_FOUND)

        ingredient_to_delete.delete()
        return Response({"message": "Ingredient deleted successfully"}, status=status.HTTP_200_OK)
    




logger = logging.getLogger(__name__)

import os
import json
import re
import logging
import requests

from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import CachedRecipe
from .models import Ingredient

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

def fetch_unsplash_image(query):
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": query,
        "client_id": UNSPLASH_ACCESS_KEY,
        "per_page": 1,
        "orientation": "landscape",
    }
    try:
        res = requests.get(url, params=params, timeout=5)
        res.raise_for_status()
        results = res.json().get("results", [])
        if results:
            return results[0]["urls"]["regular"]
            print(f"Unsplash image URL for query '{query}': {image_url}") 
    except Exception as e:
        logger.warning(f"Unsplash API error for query '{query}': {e}")
    print(f"No image found for query '{query}'")  
    return None
class AIRecipeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_ingredients = request.user.ingredients.values_list('name', flat=True)
        ingredient_list = sorted(list(user_ingredients))

        if not ingredient_list:
            return Response({"error": "No ingredients found for user."}, status=status.HTTP_400_BAD_REQUEST)

        existing_cache = CachedRecipe.objects.filter(user=request.user).order_by('-created_at').first()
        if existing_cache and existing_cache.matches_ingredients(ingredient_list):
            return Response({"recipes": existing_cache.response_json}, status=status.HTTP_200_OK)

        prompt = (
            f"Suggest 8 dishes based on these ingredients: {', '.join(ingredient_list)}. "
            "Return the response as a JSON file only, without any markdown or extra text. "
            "Each dish should include: name, description, ingredients_used (list), cuisine, difficulty, estimated_time, "
            "and step-by-step cooking instructions as a list under the key 'how_to_cook'."
        )

        try:
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": "You are a helpful AI chef."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.7,
                    "max_tokens": 1200
                },
                timeout=30
            )

            if response.status_code != 200:
                logger.error("Groq Response: %s", response.text)
                return Response({
                    "error": "Groq API call failed",
                    "detail": response.text
                }, status=status.HTTP_502_BAD_GATEWAY)

            data = response.json()
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

            if not content:
                return Response({"error": "AI returned empty response."}, status=502)

            json_str = re.sub(r"```json|```", "", content).strip()
            try:
                recipes_json = json.loads(json_str)
            except json.JSONDecodeError:
                return Response({
                    "recipes_raw": content,
                    "error": "Failed to parse JSON response from AI."
                }, status=200)

            # Add Unsplash images and default cooking instructions for each dish
            dishes = recipes_json.get("dishes", [])
            for dish in dishes:
                image_url = fetch_unsplash_image(dish["name"])
                dish["image_url"] = image_url or "https://via.placeholder.com/400x300?text=No+Image"
                # Ensure 'how_to_cook' exists, fallback to default if missing
                dish.setdefault("how_to_cook", [
                    "1. Prepare all ingredients.",
                    "2. Follow standard cooking methods for this dish.",
                    "3. Serve and enjoy!"
                ])

            # Cache result including images and instructions
            CachedRecipe.objects.create(
                user=request.user,
                ingredients_snapshot=json.dumps(ingredient_list),
                response_json=recipes_json
            )

            return Response({"recipes": recipes_json}, status=200)

        except requests.exceptions.RequestException as e:
            logger.error(f"Groq API error: {e}")
            return Response({"error": "GROQ AI service unavailable."}, status=status.HTTP_502_BAD_GATEWAY)
