from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Booking, ContactMessage, Payment, TourPackage

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "password_confirm")

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User(**validated_data, role=User.Role.USER)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "role")


class TourPackageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = TourPackage
        fields = (
            "id",
            "title",
            "description",
            "location",
            "price",
            "duration",
            "image",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if instance.image and request:
            data["image"] = request.build_absolute_uri(instance.image.url)
        elif instance.image:
            data["image"] = instance.image.url
        return data


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ("id", "amount", "method", "status", "transaction_ref", "created_at")
        read_only_fields = fields


class BookingSerializer(serializers.ModelSerializer):
    package_detail = TourPackageSerializer(source="package", read_only=True)
    payment = PaymentSerializer(read_only=True)
    user_username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Booking
        fields = (
            "id",
            "user",
            "user_username",
            "package",
            "package_detail",
            "booking_date",
            "status",
            "travelers",
            "notes",
            "payment",
        )
        read_only_fields = (
            "user",
            "booking_date",
            "status",
            "payment",
            "package_detail",
            "user_username",
        )


class BookingCreateSerializer(serializers.ModelSerializer):
    simulate_payment = serializers.BooleanField(default=True, write_only=True)
    payment_method = serializers.ChoiceField(
        choices=[c[0] for c in Payment.Method.choices],
        default=Payment.Method.CARD,
        write_only=True,
    )

    class Meta:
        model = Booking
        fields = ("package", "travelers", "notes", "simulate_payment", "payment_method")

    def create(self, validated_data):
        simulate = validated_data.pop("simulate_payment", True)
        method_key = validated_data.pop("payment_method", Payment.Method.CARD)
        request = self.context["request"]
        user = request.user
        package = validated_data["package"]
        travelers = validated_data.get("travelers", 1)
        notes = validated_data.get("notes", "")

        booking = Booking.objects.create(
            user=user,
            package=package,
            travelers=travelers,
            notes=notes,
            status=Booking.Status.PENDING,
        )

        total = package.price * travelers
        pay_status = Payment.Status.COMPLETED if simulate else Payment.Status.PENDING
        ref = f"TXN-{booking.id}-{user.id}" if simulate else ""
        payment = Payment.objects.create(
            booking=booking,
            amount=total,
            method=method_key,
            status=pay_status,
            transaction_ref=ref,
        )
        if simulate:
            booking.status = Booking.Status.CONFIRMED
            booking.save(update_fields=["status"])

        return booking


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ("id", "name", "email", "subject", "message", "created_at")
        read_only_fields = ("id", "created_at")
