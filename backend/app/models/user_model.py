def user_model(user) -> dict:
    return {
        "id": str(user['_id']),
        "name": user['name'],
        "email": user['email'],
        "password": user['password']
    }
