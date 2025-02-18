# services/kafka_service.py

import logging
import os
import threading
import asyncio
from confluent_kafka import Consumer, Producer, KafkaError
from app.services.document_service import DocumentService
from app.config.settings import settings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

logger = logging.getLogger(__name__)

class KafkaService:
    def __init__(self):
        # Kafka consumer configuration
        self.consumer = Consumer({
            "bootstrap.servers": settings.KAFKA_BROKER,
            "group.id": "python-consumer-group",
            "auto.offset.reset": "earliest",
            "partition.assignment.strategy": "roundrobin",
        })

        # Kafka producer configuration
        self.producer = Producer({
            "bootstrap.servers": settings.KAFKA_BROKER
        })

        # Subscribe to the ingest-doc topic
        self.consumer.subscribe([settings.KAFKA_INGEST_TOPIC])

        # Flag to control the Kafka consumer thread
        self.running = False

    def consume_messages(self):
        """
        Consume messages from the ingest-doc topic and trigger document ingestion.
        """
        logger.info("Starting Kafka consumer for document ingestion...")
        self.running = True
        while self.running:
            msg = self.consumer.poll(timeout=1.0)  # Poll for messages
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    logger.info("Reached end of partition")
                else:
                    logger.error(f"Kafka error: {msg.error()}")
                continue

            # Extract the file path and filename from the message
            try:
                filename = msg.value().decode("utf-8")  # Extract filename from the path
                filepath = os.path.join(BASE_DIR, "upload", filename)
                logger.info(f"Received document for ingestion: {filename}")

                # Trigger document ingestion
                document_service = DocumentService()
                asyncio.run(document_service.ingest_docs(filepath, filename))

                # Send ingestion completed message
                # sad
                logger.info(f"Ingestion message triigered {filename}")
                self.producer.produce(
                    settings.KAFKA_COMPLETED_TOPIC,
                    key='ingestion-completed',
                    value=filename
                )
                logger.info(f"[KafkaService]Received document for ingestion: {filename}")
                self.producer.flush()  # Ensure the message is sent
                logger.info(f"Ingestion completed for {filename}")
            except Exception as e:
                logger.error(f"Failed to process message: {e}")

    def start(self):
        """
        Start the Kafka consumer in a separate thread.
        """
        self.thread = threading.Thread(target=self.consume_messages, daemon=True)
        self.thread.start()

    def stop(self):
        """
        Stop the Kafka consumer thread.
        """
        self.running = False
        self.thread.join()
        self.close()

    def close(self):
        """
        Close the Kafka consumer and producer.
        """
        self.consumer.close()
        self.producer.flush()
        logger.info("Kafka consumer and producer closed.")