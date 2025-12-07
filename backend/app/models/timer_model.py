from fastapi import HTTPException


def timer_model(timer) -> dict:
    if not timer:
        raise HTTPException(status_code=500, detail="timer data missing")

    return {
        "id": str(timer['_id']),
        "time": str(timer['time'])
    }
