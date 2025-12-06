def movie_model(movie) -> dict:
    return {
        "id": str(movie["_id"]),
        "name": movie['name'],
        "release_date": movie["release_date"],
        "rating": movie['rating'],
        "tags": movie['tags']
    }
