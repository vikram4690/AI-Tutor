import os, glob
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import SentenceTransformerEmbeddings

load_dotenv()

DATA_DIR = os.getenv("DATA_DIR", "./data")
INDEX_PATH = os.getenv("INDEX_PATH", "./storage/faiss_index")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

def load_docs():
    docs = []
    for path in glob.glob(os.path.join(DATA_DIR, "**/*"), recursive=True):
        if path.lower().endswith(".txt"):
            docs.extend(TextLoader(path, encoding="utf-8").load())
        elif path.lower().endswith(".pdf"):
            docs.extend(PyPDFLoader(path).load())
    return docs

def main():
    docs = load_docs()
    if not docs:
        print("No documents found in", DATA_DIR)
        return

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    split_docs = splitter.split_documents(docs)

    embeddings = SentenceTransformerEmbeddings(model_name=EMBEDDING_MODEL)
    vs = FAISS.from_documents(split_docs, embeddings)
    vs.save_local(INDEX_PATH)
    print("Saved index to", INDEX_PATH, "with", len(split_docs), "chunks.")

if __name__ == "__main__":
    main()
