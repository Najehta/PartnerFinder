# Generated by Django 2.2.10 on 2020-05-26 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finder', '0040_auto_20200522_1857'),
    ]

    operations = [
        migrations.CreateModel(
            name='Scores',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('RSE', models.FloatField(default=0, null=True)),
                ('Italy', models.FloatField(default=0, null=True)),
                ('France', models.FloatField(default=0, null=True)),
                ('Austria', models.FloatField(default=0, null=True)),
                ('Germany', models.FloatField(default=0, null=True)),
                ('Denmark', models.FloatField(default=0, null=True)),
                ('Czech_Republic', models.FloatField(default=0, null=True)),
                ('Finland', models.FloatField(default=0, null=True)),
                ('Ireland', models.FloatField(default=0, null=True)),
                ('Israel', models.FloatField(default=0, null=True)),
                ('Portugal', models.FloatField(default=0, null=True)),
                ('Ukranie', models.FloatField(default=0, null=True)),
                ('United_Kingdom', models.FloatField(default=0, null=True)),
                ('Turkey', models.FloatField(default=0, null=True)),
                ('Switzerland', models.FloatField(default=0, null=True)),
                ('Spain', models.FloatField(default=0, null=True)),
                ('Norway', models.FloatField(default=0, null=True)),
                ('Association_Agency', models.FloatField(default=0, null=True)),
                ('University', models.FloatField(default=0, null=True)),
                ('Company', models.FloatField(default=0, null=True)),
                ('R_D_Institution', models.FloatField(default=0, null=True)),
                ('Start_Up', models.FloatField(default=0, null=True)),
                ('Others', models.FloatField(default=0, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='call',
            name='hasConsortium',
            field=models.BooleanField(default=False),
        ),
    ]