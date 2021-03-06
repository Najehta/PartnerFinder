from rest_framework import serializers

from ..models import OrganizationProfile, Address, Tag, Event, Participants, Location, \
    TagP, MapIds, Call, CallTag, AlertsSettings, UpdateSettings, Scores, EventsForAlerts,\
    IsfCalls, InnovationCalls, MstCalls, bsfCalls, TechnionCalls, EuCalls, EmailSubscription,UpdateTime


class MapIdsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapIds
        fields = '__all__'


class AlertsSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertsSettings
        fields = '__all__'


class UpdateSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpdateSettings
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['country', 'city']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['tag', 'organizations']


class OrganizationProfileSerializer(serializers.ModelSerializer):
    address = AddressSerializer(many=False)
    tagsAndKeywords = TagSerializer(many=True)

    class Meta:
        model = OrganizationProfile
        fields = '__all__'


class CallTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallTag

    fields = '__all__'


class CallSerializer(serializers.ModelSerializer):
    tagsAndKeywords = TagSerializer(many=True)

    class Meta:
        model = Call
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['_id', 'event_name', 'event_url']


class TagPSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagP
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class ParticipantsSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False)
    tags = TagPSerializer(many=True)

    class Meta:
        model = Participants
        fields = '__all__'


class ScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scores
        fields = '__all__'


class EventsForAlertsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventsForAlerts
        fields = ['event_name', 'event_url']


class BsfCallsSerializer(serializers.ModelSerializer):
    class Meta:
        model = bsfCalls
        fields = '__all__'

class IsfCallsSerializer(serializers.ModelSerializer):
    class Meta:
        model = IsfCalls
        fields = '__all__'

class InnovationCallsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InnovationCalls
        fields = '__all__'

class MstCallsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MstCalls
        fields = '__all__'

class TechnionCallsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnionCalls
        fields = '__all__'

class EuCallsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EuCalls
        fields = '__all__'

class EmailSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailSubscription
        fields = '__all__'

class UpdateTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpdateTime
        fields = '__all__'
