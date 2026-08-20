import os
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
from dotenv import load_dotenv

load_dotenv()

CHROMA_PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

def populate_mock_data():
    if not os.getenv("GEMINI_API_KEY"):
        print("Error: GEMINI_API_KEY environment variable not set.")
        return

    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2")
    vector_store = Chroma(
        collection_name="textbook_content",
        embedding_function=embeddings,
        persist_directory=CHROMA_PERSIST_DIR
    )

    documents = [
        Document(
            page_content="The second law of motion states that the rate of change of momentum of an object is proportional to the applied unbalanced force in the direction of force.",
            metadata={"source": "NCERT Class 9 Physics", "chapter": "9", "page": 118}
        ),
        Document(
            page_content="Momentum, p, of an object is defined as the product of its mass, m, and velocity, v. That is, p = mv. Momentum has both direction and magnitude.",
            metadata={"source": "NCERT Class 9 Physics", "chapter": "9", "page": 116}
        ),
        Document(
            page_content="Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.",
            metadata={"source": "NCERT Class 10 Biology", "chapter": "6", "page": 96}
        )
    ]

    print(f"Adding {len(documents)} documents to Chroma DB...")
    vector_store.add_documents(documents)
    print("Successfully populated mock textbook data!")

if __name__ == "__main__":
    populate_mock_data()
