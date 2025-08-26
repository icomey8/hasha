from ..test_main import client
from unittest.mock import patch, MagicMock
from ..main import app
from ..dependencies import auth_dependency
from ..auth.auth import extract_token
import pytest
from ..fixtures import *


def test_read_user(mock_supabase_get_users_success, mock_auth_dependency, mock_extract_token):
    """Test a successful fetch of user data"""
    app.dependency_overrides[auth_dependency] = mock_auth_dependency
    app.dependency_overrides[extract_token] = mock_extract_token
    
    response = client.get("/users/")
    
    expected_data = [
            {"id": 1, "cognito_id": "user-123", "username": "testuser"},
            {"id": 2, "cognito_id": "user-456", "username": "anotheruser"}
        ]
    
    assert response.status_code == 200
    assert response.json() == expected_data
    mock_supabase_get_users_success.from_.assert_called_with("users")
    mock_supabase_get_users_success.from_.return_value.select.assert_called_with("*")
    app.dependency_overrides.clear()
    

def test_create_user(mock_supabase_insert_user_success, mock_valid_backend_secret):
    """Test a successful creation of user in supabase table"""
    app.dependency_overrides[extract_token] = mock_valid_backend_secret
    
    user_data = {
        "id": "some-user-id",
        "email": "username8"
    }
    
    response = client.post("/users/create-user", json=user_data)
    
    assert response.status_code == 200
    assert response.json() == {"status": "success"}
    
    expected_data = {
        "cognito_id": user_data["id"],
        "username": user_data["email"]
    }
    
    mock_supabase_insert_user_success.table.return_value.insert.assert_called_with(expected_data)
    app.dependency_overrides.clear()
    


def test_create_user_bad_token(mock_invalid_backend_secret):
    """Test when /create-user receives an invalid backend-secret"""
    app.dependency_overrides[extract_token] = mock_invalid_backend_secret
    
    user_data = {
        "id": "some-user-id",
        "email": "username8"
    }
    
    response = client.post("/users/create-user", json=user_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Unauthorized"
    app.dependency_overrides.clear()