from typing import Callable
import random


class Matcher:
    def __init__(self):
        pass
        self._emotions = list(
            {
                "happy": {},
                "sad": {},
                "angry": {},
                "relaxed": {},
                "excited": {},
                "anxious": {},
                "bored": {},
                "nostalgic": {},
                "confident": {},
                "romantic": {},
            }.keys()
        )

    def get_matches(
        self,
        emotions: list[str],
        get_emotions_function: Callable,
        tags: dict,
        watched: list[str],
    ):
        result_queries = []
        added_titles = set()
        lm = 10
        genres = [
            "Action",
            "Adventure",
            "Animation",
            "Biography",
            "Comedy",
            "Crime",
            "Documentary",
            "Drama",
            "Family",
            "Fantasy",
            "Film-Noir",
            "Game-Show",
            "History",
            "Horror",
            "Music",
            "Musical",
            "Mystery",
            "News",
            "Reality-TV",
            "Romance",
            "Sci-Fi",
            "Short",
            "Sport",
            "Talk-Show",
            "Thriller",
            "War",
            "Western",
        ]
        new_tags = {}
        for genre in genres :
            for emotion in self._emotions:
                if genre in new_tags:
                    new_tags[genre] += tags[emotion][genre]
                else:
                    new_tags[genre] = tags[emotion][genre]
        temp_tags = [(key, new_tags[key]) for key in new_tags.keys()]
        temp_tags.sort(key=lambda x: x[1], reverse=True)
        new_tags = [tag[0] for tag in temp_tags]


        for tag in new_tags:
            if len(result_queries) >= 6:
                break
            for i in range(10000):
                if len(result_queries) >= 6:
                    break
                temp_query = get_emotions_function(genres=tag, limit=lm)
                for entry in temp_query:
                    if (
                        entry["id"] not in watched
                        and entry["id"] not in added_titles
                    ):
                        result_queries.append(entry)
                        added_titles.add(entry["id"])
                lm += 10

        for _ in range(1000):
            if len(result_queries) < 6:
                genre = random.choice(genres)
                temp_query = get_emotions_function(genres=genre, limit=100)
                for entry in temp_query:
                    if entry["id"] not in watched and entry["id"] not in added_titles:
                        result_queries.append(entry)
                        added_titles.add(entry["id"])
            else:
                break

        try:
            result = list(result_queries)
            random.shuffle(result)
            result = result[:6]
        except Exception as e:
            print(e)
            result = list(result_queries)
        return result
