def _register(client, email="alice@example.com", password="password123", full_name="Alice"):
    return client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": password, "full_name": full_name},
    )


def test_register_creates_user(client):
    res = _register(client)
    assert res.status_code == 201
    body = res.json()
    assert body["email"] == "alice@example.com"
    assert body["full_name"] == "Alice"
    assert "password" not in body
    assert "password_hash" not in body


def test_register_duplicate_email_conflict(client):
    _register(client)
    res = _register(client)
    assert res.status_code == 409


def test_register_invalid_email_rejected(client):
    res = client.post("/api/v1/auth/register", json={"email": "not-an-email", "password": "password123"})
    assert res.status_code == 422


def test_register_short_password_rejected(client):
    res = _register(client, password="short")
    assert res.status_code == 422


def test_login_returns_tokens(client):
    _register(client)
    res = client.post("/api/v1/auth/login", json={"email": "alice@example.com", "password": "password123"})
    assert res.status_code == 200
    body = res.json()
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["token_type"] == "bearer"


def test_login_wrong_password_rejected(client):
    _register(client)
    res = client.post("/api/v1/auth/login", json={"email": "alice@example.com", "password": "wrongpass1"})
    assert res.status_code == 401


def test_login_unknown_email_rejected(client):
    res = client.post("/api/v1/auth/login", json={"email": "nobody@example.com", "password": "password123"})
    assert res.status_code == 401


def test_refresh_issues_new_tokens(client):
    _register(client)
    login = client.post(
        "/api/v1/auth/login", json={"email": "alice@example.com", "password": "password123"}
    ).json()
    res = client.post("/api/v1/auth/refresh", json={"refresh_token": login["refresh_token"]})
    assert res.status_code == 200
    body = res.json()
    assert body["access_token"]
    assert body["refresh_token"]


def test_refresh_rejects_access_token(client):
    _register(client)
    login = client.post(
        "/api/v1/auth/login", json={"email": "alice@example.com", "password": "password123"}
    ).json()
    res = client.post("/api/v1/auth/refresh", json={"refresh_token": login["access_token"]})
    assert res.status_code == 401


def test_me_returns_current_user(client):
    _register(client)
    login = client.post(
        "/api/v1/auth/login", json={"email": "alice@example.com", "password": "password123"}
    ).json()
    res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {login['access_token']}"},
    )
    assert res.status_code == 200
    assert res.json()["email"] == "alice@example.com"


def test_me_requires_auth(client):
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401


def test_email_normalized_to_lowercase(client):
    _register(client, email="ALICE@Example.COM")
    res = client.post("/api/v1/auth/login", json={"email": "alice@example.com", "password": "password123"})
    assert res.status_code == 200
