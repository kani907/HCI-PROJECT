from typing import Callable
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
                    print(tag)
                    if tags[emotion][tag] > 0:
                        ggg = ",".join(cur_tags).rstrip(",")
                        print(ggg, "sraka")
                        temp_query = get_emotions_function(genres = tag, limit=lm)
                        print(temp_query)
                        for entry in temp_query:
                            print(entry)
                            if entry["id"] not in watched and entry["id"] not in added_titles:
                                result_queries.append(entry)
                                added_titles.add(entry["id"])
            lm+=10
        return list(result_queries)
