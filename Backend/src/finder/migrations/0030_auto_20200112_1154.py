# Generated by Django 2.0 on 2020-01-12 11:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finder', '0029_auto_20200112_1148'),
    ]

    operations = [
        migrations.AlterField(
            model_name='participants',
            name='tags',
            field=models.ManyToManyField(related_name='participants_tags', to='finder.TagP'),
        ),
    ]
