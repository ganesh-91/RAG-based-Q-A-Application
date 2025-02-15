import aio_pika
import json

class RabbitMQ:
    def __init__(self, queue_name):
        self.queue_name = queue_name
        self.connection = None
        self.channel = None

    async def connect(self):
        self.connection = await aio_pika.connect_robust("amqp://guest:guest@localhost/")
        self.channel = await self.connection.channel()
        await self.channel.declare_queue(self.queue_name, durable=True)

    async def send_message(self, message):
        await self.channel.default_exchange.publish(
            aio_pika.Message(body=json.dumps(message).encode()),
            routing_key=self.queue_name,
        )
        print(f"Sent message to {self.queue_name}: {message}")

    async def consume_messages(self, callback):
        queue = await self.channel.declare_queue(self.queue_name, durable=True)
        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    body = json.loads(message.body.decode())
                    await callback(body)

    async def close(self):
        await self.connection.close()