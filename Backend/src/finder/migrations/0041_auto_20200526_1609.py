# Generated by Django 2.2.10 on 2020-05-26 13:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finder', '0040_auto_20200522_1857'),
    ]

    operations = [
        migrations.CreateModel(
            name='AlertsSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(blank=True, default='ishai@freemindconsultants.com', max_length=300)),
                ('turned_on', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='UpdateSettings',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('eu_last_update', models.DateTimeField()),
                ('b2match_last_update', models.DateTimeField()),
            ],
        ),
        migrations.AddField(
            model_name='call',
            name='hasConsortium',
            field=models.BooleanField(default=False),
        ),
    ]
