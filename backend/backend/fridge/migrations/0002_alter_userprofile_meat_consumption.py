# Generated by Django 5.1.7 on 2025-03-25 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fridge', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='meat_consumption',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
