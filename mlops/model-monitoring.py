#!/usr/bin/env python3
"""
MLOps Model Monitoring for QuickSME
Monitors ML models used for financial forecasting and anomaly detection
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any
import pandas as pd
from prometheus_client import Counter, Gauge, Histogram, start_http_server
import joblib
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Prometheus metrics
MODEL_PREDICTIONS = Counter('model_predictions_total', 'Total predictions made', ['model_name', 'version'])
MODEL_LATENCY = Histogram('model_prediction_latency_seconds', 'Prediction latency', ['model_name'])
MODEL_ACCURACY = Gauge('model_accuracy', 'Model accuracy metric', ['model_name'])
DATA_DRIFT = Gauge('data_drift_score', 'Data drift detection score', ['feature'])
MODEL_HEALTH = Gauge('model_health_status', 'Model health status (0=unhealthy, 1=healthy)', ['model_name'])

class ModelMonitor:
    def __init__(self, model_name: str, version: str = "1.0.0"):
        self.model_name = model_name
        self.version = version
        self.reference_data = None
        self.prediction_history = []
        self.accuracy_threshold = 0.85
        self.drift_threshold = 0.1

    def load_reference_data(self, data_path: str):
        """Load reference data for drift detection"""
        try:
            self.reference_data = pd.read_csv(data_path)
            logger.info(f"Loaded reference data with {len(self.reference_data)} samples")
        except Exception as e:
            logger.error(f"Failed to load reference data: {e}")

    def monitor_prediction(self, features: Dict[str, Any], prediction: Any, actual: Any = None):
        """Monitor a single prediction"""
        start_time = datetime.now()

        # Record prediction
        MODEL_PREDICTIONS.labels(self.model_name, self.version).inc()

        # Calculate latency
        latency = (datetime.now() - start_time).total_seconds()
        MODEL_LATENCY.labels(self.model_name).observe(latency)

        # Store prediction for analysis
        self.prediction_history.append({
            'timestamp': datetime.now(),
            'features': features,
            'prediction': prediction,
            'actual': actual
        })

        # Keep only last 1000 predictions
        if len(self.prediction_history) > 1000:
            self.prediction_history = self.prediction_history[-1000:]

        # Calculate accuracy if actual value provided
        if actual is not None:
            accuracy = self._calculate_accuracy()
            MODEL_ACCURACY.labels(self.model_name).set(accuracy)

        # Check for data drift
        self._check_data_drift(features)

        # Update model health
        health_score = self._calculate_health_score()
        MODEL_HEALTH.labels(self.model_name).set(health_score)

    def _calculate_accuracy(self) -> float:
        """Calculate model accuracy from recent predictions"""
        recent_predictions = [p for p in self.prediction_history[-100:]
                            if p['actual'] is not None]

        if not recent_predictions:
            return 0.0

        correct = sum(1 for p in recent_predictions
                     if abs(p['prediction'] - p['actual']) < 0.1)  # 10% tolerance

        return correct / len(recent_predictions)

    def _check_data_drift(self, features: Dict[str, Any]):
        """Check for data drift using statistical tests"""
        if self.reference_data is None:
            return

        for feature_name, feature_value in features.items():
            if feature_name in self.reference_data.columns:
                reference_values = self.reference_data[feature_name].values
                drift_score = self._calculate_drift_score(reference_values, feature_value)
                DATA_DRIFT.labels(feature_name).set(drift_score)

    def _calculate_drift_score(self, reference_values: np.ndarray, current_value: float) -> float:
        """Calculate drift score using Kolmogorov-Smirnov test"""
        try:
            from scipy.stats import ks_2samp
            # Compare distribution of reference data with recent predictions
            recent_values = [p['features'].get(list(reference_values.keys())[0], current_value)
                           for p in self.prediction_history[-50:]]

            if len(recent_values) < 10:
                return 0.0

            statistic, _ = ks_2samp(reference_values, recent_values)
            return statistic
        except ImportError:
            # Fallback to simple mean difference
            reference_mean = np.mean(reference_values)
            return abs(current_value - reference_mean) / reference_mean

    def _calculate_health_score(self) -> float:
        """Calculate overall model health score"""
        accuracy = self._calculate_accuracy()
        recent_drift_scores = [p.get('drift_score', 0) for p in self.prediction_history[-10:]]

        avg_drift = np.mean(recent_drift_scores) if recent_drift_scores else 0

        # Health score based on accuracy and drift
        health = 0.7 * accuracy + 0.3 * (1 - avg_drift)

        return max(0, min(1, health))

    def get_model_metrics(self) -> Dict[str, Any]:
        """Get comprehensive model metrics"""
        return {
            'model_name': self.model_name,
            'version': self.version,
            'accuracy': self._calculate_accuracy(),
            'total_predictions': len(self.prediction_history),
            'health_score': self._calculate_health_score(),
            'last_prediction': self.prediction_history[-1] if self.prediction_history else None
        }

# Global model registry
model_registry: Dict[str, ModelMonitor] = {}

def get_model_monitor(model_name: str, version: str = "1.0.0") -> ModelMonitor:
    """Get or create a model monitor"""
    key = f"{model_name}:{version}"
    if key not in model_registry:
        model_registry[key] = ModelMonitor(model_name, version)
    return model_registry[key]

def start_monitoring_server(port: int = 8000):
    """Start Prometheus metrics server"""
    start_http_server(port)
    logger.info(f"Model monitoring server started on port {port}")

if __name__ == "__main__":
    # Example usage
    start_monitoring_server()

    # Create model monitor
    monitor = get_model_monitor("financial_forecast", "1.0.0")

    # Load reference data
    # monitor.load_reference_data("data/reference_financial_data.csv")

    # Monitor predictions
    # monitor.monitor_prediction({"revenue": 100000, "expenses": 80000}, 15000, 14500)
