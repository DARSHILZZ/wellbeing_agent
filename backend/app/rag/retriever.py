class MockRetriever:
    def __init__(self):
        self.mock_db = [
            {
                "source": "NCERT Class 9 Physics",
                "chapter": "Ch 9: Force and Laws of Motion",
                "page": 118,
                "content": "The second law of motion states that the rate of change of momentum of an object is proportional to the applied unbalanced force in the direction of force."
            }
        ]

    def search(self, query: str):
        # Mock search returning the first chunk
        return self.mock_db

retriever = MockRetriever()
