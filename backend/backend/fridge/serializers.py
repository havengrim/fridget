from rest_framework import serializers
from .models import Ingredient

class IngredientSerializer(serializers.ModelSerializer):
    name = serializers.ListField(child=serializers.CharField(), allow_empty=False)  # ✅ Accepts an array

    class Meta:
        model = Ingredient
        fields = ["name", "category"]