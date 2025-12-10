from typing import Callable
import random
class Matcher:
    def __init__(self):
        pass

    def get_matches(self, emotions: list[str], get_emotions_function: Callable, tags: dict, watched: list[str]):
        result_queries= []
        added_titles = set()
        lm=10
        for i in range(10000):
            if len(result_queries) >= 6:
                break
            for emotion in emotions:
                cur_tags = list(tags[emotion].keys())
                for tag in cur_tags:
                    # print(tag)
                    if tags[emotion][tag] > 0:
                        ggg = ",".join(cur_tags).rstrip(",")
                        # print(ggg, "sraka")
                        temp_query = get_emotions_function(genres = tag, limit=lm)
                        # print(temp_query)
                        for entry in temp_query:
                            # print(entry)
                            if entry["id"] not in watched and entry["id"] not in added_titles:
                                result_queries.append(entry)
                                added_titles.add(entry["id"])
            lm+=10
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
                "Western"
            ]

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
