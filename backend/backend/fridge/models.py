from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import json
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    allergies = models.JSONField(default=list, blank=True)
    spiciness = models.IntegerField(default=1)
    meat_consumption = models.CharField(max_length=20, blank=True, null=True)
    fish_consumption = models.CharField(max_length=20, blank=True,  null=True)
    vegetable_consumption = models.CharField(max_length=20, blank=True,  null=True)

    def __str__(self):
        return self.user.username

class Ingredient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ingredients")
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.category})"
    
# 🚀 Automatically create a UserProfile when a User is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class CachedRecipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredients_snapshot = models.TextField()  # Store as sorted stringified list
    response_json = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def matches_ingredients(self, ingredients):
        return json.loads(self.ingredients_snapshot) == sorted(ingredients)