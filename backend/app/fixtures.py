import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def mock_supabase_insert_recipe_success():
    with patch('app.routers.recipes.create_client') as mock_create_client:
        mock_client = MagicMock()
        mock_client.table.return_value.insert.return_value.execute.return_value.data = {"id": 1}
        mock_create_client.return_value = mock_client
        yield mock_client
        
@pytest.fixture
def mock_supabase_insert_user_success():
    with patch('app.routers.users.service_client') as mock_service_client:
        mock_service_client.table.return_value.insert.return_value.execute.return_value.data = {"id": 1}
        yield mock_service_client

@pytest.fixture
def mock_supabase_failure():
    with patch('app.routers.recipes.create_client') as mock_create_client:
        mock_client = MagicMock()
        mock_client.table.return_value.insert.return_value.execute.side_effect = Exception("Database error")
        mock_create_client.return_value = mock_client
        yield mock_client
    
@pytest.fixture
def mock_supabase_get_users_success():
    with patch('app.routers.users.create_client') as mock_create_client:
        mock_client = MagicMock()
        mock_client.from_.return_value.select.return_value.execute.return_value.data = [
            {"id": 1, "cognito_id": "user-123", "username": "testuser"},
            {"id": 2, "cognito_id": "user-456", "username": "anotheruser"}
        ]
        mock_create_client.return_value = mock_client
        yield mock_client

@pytest.fixture
def mock_supabase_user_not_found():
    with patch('app.routers.recipes.create_client') as mock_create_client:
        mock_client = MagicMock()
        mock_client.table.return_value.insert.return_value.execute.side_effect = Exception("Foreign key constraint violation: user_id not found")
        mock_create_client.return_value = mock_client
        yield mock_client
        
@pytest.fixture
def mock_supabase_auth_error():
    with patch('app.routers.recipes.create_client') as mock_create_client:
        mock_create_client.side_effect = Exception("Invalid JWT token")
        yield mock_create_client
        
@pytest.fixture        
def mock_auth_dependency():
    def _mock_auth():
        return {"sub": "test-user-123", "email": "test@example.com"}
    return _mock_auth
        
@pytest.fixture
def mock_extract_token():
    def _mock_token():
        return "mock-jwt-token"
    return _mock_token

@pytest.fixture
def mock_invalid_auth():
    def _mock_invalid_auth():
        return None  
    return _mock_invalid_auth

@pytest.fixture
def mock_invalid_token():
    def _mock_invalid_token():
        return None  
    return _mock_invalid_token

@pytest.fixture
def mock_invalid_backend_secret():
    def _mock_invalid_backend_secret():
        return "This is an invalid secret value."  
    return _mock_invalid_backend_secret

@pytest.fixture
def mock_valid_backend_secret():
    test_secret = "test_example_secret_123"
    with patch('app.routers.users.backend_secret', test_secret):
        def _mock_valid_backend_secret():
            return test_secret
        yield _mock_valid_backend_secret