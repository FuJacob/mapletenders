"""Hello unit test module."""

from apps.rfp_backend.hello import hello


def test_hello():
    """Test the hello function."""
    assert hello() == "Hello apps/rfp-backend"
