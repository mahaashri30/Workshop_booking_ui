from django.urls import path, re_path
from django.contrib.auth.views import password_reset, password_reset_confirm,\
        password_reset_done, password_reset_complete, password_change,\
        password_change_done

urlpatterns = [
    path('forgotpassword/', password_reset,
        name="password_reset"),
    re_path(r'^password_reset/(?P<uidb64>[0-9A-Za-z]+)-(?P<token>.+)/$',
        password_reset_confirm,
        name='password_reset_confirm'),
    path('password_reset/mail_sent/', password_reset_done,
        name='password_reset_done'),
    path('password_reset/complete/', password_reset_complete,
        name='password_reset_complete'),
    path('changepassword/', password_change,
        name='password_change'),
    path('password_change/done/', password_change_done,
        name='password_change_done'),
]
