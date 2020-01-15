# Generated by Django 2.0 on 2020-01-12 11:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finder', '0030_auto_20200112_1154'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='participants',
            name='tags',
        ),
        migrations.AddField(
            model_name='tagp',
            name='participant',
            field=models.ManyToManyField(blank=True, related_name='participants_tags', to='finder.Participants'),
        ),
    ]
