from ..test_main import client
from unittest.mock import patch, MagicMock
from ..main import app
from ..dependencies import auth_dependency
from ..auth.auth import extract_token
import pytest
from ..fixtures import *

def test_create_recipe(mock_supabase_insert_recipe_success, mock_auth_dependency, mock_extract_token):
    """Test a successful insertion of recipe into supabase"""
    app.dependency_overrides[auth_dependency] = mock_auth_dependency
    app.dependency_overrides[extract_token] = mock_extract_token
    recipe_data = {
            "name": "Test Recipe",
            "preparation": [{"text": "Step 1"}, {"text": "Step 2"}],
            "ingredients": [{"name": "ingredient 1", "amount": "6 oz"}, {"name": "ingredient 2", "amount": "1 bag"}],
            "totalTime": "30 minutes",
            "type": "entree",
            "cuisine": "Italian"
        }
        
    response = client.post("/recipes/create-recipe", json=recipe_data)
        
    assert response.status_code == 200        
    assert response.json() == {"status": "success"}
        
    expected_insert_data = {
            "name": "Test Recipe",
            "preparation": [{"text": "Step 1"}, {"text": "Step 2"}],
            "ingredients": [{"name": "ingredient 1", "amount": "6 oz"}, {"name": "ingredient 2", "amount": "1 bag"}],
            "user_id": "test-user-123",
            "metadata": {
                "total_time": "30 minutes",
                "type": "entree",
                "cuisine": "Italian"
            }
        }
        
    mock_supabase_insert_recipe_success.table.return_value.insert.assert_called_with(expected_insert_data)
    app.dependency_overrides.clear()
    

def test_create_recipe_missing_data(mock_supabase_insert_recipe_success, mock_auth_dependency, mock_extract_token):
    """Test when backend receives incomplete data object"""
    app.dependency_overrides[auth_dependency] = mock_auth_dependency
    app.dependency_overrides[extract_token] = mock_extract_token
    
    recipe_data = {
            "name": "Test Recipe",
            "preparation": [{"text": "Step 1"}, {"text": "Step 2"}],
            "ingredients": [{"name": "ingredient 1", "amount": "6 oz"}, {"name": "ingredient 2", "amount": "1 bag"}],
        }
    
    response = client.post("/recipes/create-recipe", json=recipe_data)
    
    assert response.status_code == 500
    assert "Failed to create recipe in database" in response.json()["detail"]
    app.dependency_overrides.clear()


def test_create_recipe_bad_user(mock_supabase_user_not_found, mock_auth_dependency, mock_extract_token):
    """Test when user_id doesn't exist in Supabase users table"""
    app.dependency_overrides[auth_dependency] = mock_auth_dependency
    app.dependency_overrides[extract_token] = mock_extract_token
    
    recipe_data = {
        "name": "Test Recipe",
        "preparation": [{"text": "Step 1"}],
        "ingredients": [{"name": "ingredient 1"}],
        "totalTime": "30 minutes",
        "type": "entree",
        "cuisine": "Italian"
    }
    
    response = client.post("/recipes/create-recipe", json=recipe_data)
    
    assert response.status_code == 500
    assert "user_id not found" in response.json()["detail"]
    app.dependency_overrides.clear()


def test_create_recipe_bad_token(mock_supabase_auth_error, mock_auth_dependency, mock_invalid_token):
    """Test when Supabase rejects the JWT token during client creation"""
    app.dependency_overrides[auth_dependency] = mock_auth_dependency  
    app.dependency_overrides[extract_token] = mock_invalid_token
    
    recipe_data = {
        "name": "Test Recipe", 
        "preparation": [{"text": "Step 1"}],
        "ingredients": [{"name": "ingredient 1"}],
        "totalTime": "30 minutes",
        "type": "entree", 
        "cuisine": "Italian"
    }
    
    response = client.post("/recipes/create-recipe", json=recipe_data)
    
    assert response.status_code == 500
    assert "Invalid JWT token" in response.json()["detail"]
    app.dependency_overrides.clear()