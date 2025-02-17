# # app/services/postgres_service.py
# import psycopg2
# from app.utils.config import Config

# def save_embedding(document_path, embedding):
#     conn = psycopg2.connect(Config.POSTGRES_URL)
#     cur = conn.cursor()
#     cur.execute("INSERT INTO document_embeddings (document_path, embedding) VALUES (%s, %s)", (document_path, embedding))
#     conn.commit()
#     cur.close()
#     conn.close()