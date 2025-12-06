from typing import Callable
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

class Matcher:
    def __init__(self, actualize: Callable, data: np.ndarray) -> None:    
        def __get_Kmeans_value(data: np.ndarray) -> int:
            values = range(2, 20)
            silhouetes = []
            for value in values:
                k_means = KMeans(value).fit_predict(data)
                silhouetes.append(silhouette_score(data, k_means.labels_))
            
            return int(np.argmax(silhouetes) + 2)
        
        self.__actualize = actualize
        self.__kmeans_value = __get_Kmeans_value(data)

    def get_point_labels(self,  data: np.ndarray):
        k_means = KMeans(self.__kmeans_value).fit_predict(data)

        return k_means.labels_, k_means.cluster_centers_

    def __get_distances(self, reference_point: np.ndarray, points: np.ndarray):
        distances = np.linalg.norm(points - reference_point, axis=1)

        return distances
    
    def get_best_match(self, reference_point: np.ndarray, centers: np.ndarray, points: list):
        to_centers = self.__get_distances(reference_point, centers)
        min_center = np.argmin(to_centers)
        
        candidates = [point for point in points if point.cluster == min_center]
        
        if not candidates:
            return []

        candidates_locations = np.array([point.location for point in candidates])

        to_points = self.__get_distances(reference_point, candidates_locations)
        
        sorted_indices = np.argsort(to_points)
        
        best_matches = [candidates[i] for i in sorted_indices]
        
        return best_matches
