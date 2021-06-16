from rest_framework import routers

from django.urls import path, include
from .views import OrganizationProfileViewSet, EventViewSet, ParticipantsViewSet, CallViewSet, \
    UpdateSettingsViewSet, AlertsSettingsViewSet, ScoresViewSet, AlertsB2match, BsfCallsViewSet, \
    IsfCallsViewSet, InnovCallsViewSet, MstCallsViewSet, TechnionCallsViewSet, EuCallsViewSet,\
    ProposalCallsViewSet, EmailSubscriptionViewSet\
    , UpdateCallsViewSet, UpdateTimeViewSet

router = routers.DefaultRouter()

router.register('organizations', OrganizationProfileViewSet)
router.register('', OrganizationProfileViewSet)
router.register('updates', UpdateSettingsViewSet)
router.register('alerts', AlertsSettingsViewSet)
router.register('calls', CallViewSet)

router.register('events', EventViewSet)
router.register('participants', ParticipantsViewSet)
router.register('scores', ScoresViewSet)
router.register("b2matchalerts", AlertsB2match)

router.register('bsfcalls', BsfCallsViewSet)
router.register('isfcalls', IsfCallsViewSet)
router.register('innovcalls', InnovCallsViewSet)
router.register('mstcalls', MstCallsViewSet)
router.register('technioncalls', TechnionCallsViewSet)
router.register('eucalls', EuCallsViewSet)
router.register('proposal', ProposalCallsViewSet)
router.register('EmailSubscription', EmailSubscriptionViewSet)
router.register('update', UpdateCallsViewSet, basename='UpdateCalls')
router.register('updateTime', UpdateTimeViewSet)

urlpatterns = [
    path('', include(router.urls))
]
