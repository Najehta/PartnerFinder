# Generated by Django 2.2.10 on 2020-05-17 00:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finder', '0037_mapids_mapidsb2match'),
    ]

    operations = [
        migrations.CreateModel(
            name='MapIDsB2matchUpcoming',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('originalID', models.IntegerField(unique=True)),
                ('indexID', models.IntegerField(unique=True)),
            ],
        ),
    ]