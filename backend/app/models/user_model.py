from fastapi import HTTPException


def user_model(user) -> dict:
    if not user:
        raise HTTPException(status_code=500, detail="User data missing")

    return {
        "id": str(user['_id']),
        "name": user['name'],
        "email": user['email'],
        "algorithm": user['algorithm'],
        "role": user.get('role') or 'user',
        "history": user.get('history', [])
    }
