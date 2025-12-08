from typing import Callable
class Matcher:
    def __init__(self):
        pass

    def get_matches(self, emotions: list[str], get_emotions_function: Callable, tags: dict, watched: list[str]):
        result_queries= set()
        lm=10
        for i in range(10000):
            if len(result_queries) >= 6:
                break
            for emotion in emotions:
                cur_tags = tags[emotion].keys()
                for tag in cur_tags:
                    temp_query = get_emotions_function(name = ",".join(cur_tags), limit=lm)
                    for entry in temp_query:
                        if entry["id"] not in watched:
                            result_queries.add(entry)
            lm+=10
        return list(result_queries)