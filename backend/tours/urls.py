from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import BookingViewSet, ContactMessageView, MeView, RegisterView, TourPackageViewSet

router = DefaultRouter()
router.register(r"packages", TourPackageViewSet, basename="package")
router.register(r"bookings", BookingViewSet, basename="booking")

urlpatterns = [
    path("contact/", ContactMessageView.as_view(), name="contact"),
    path("users/register/", RegisterView.as_view(), name="register"),
    path("users/me/", MeView.as_view(), name="me"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
