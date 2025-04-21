from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
import os
import time

app = Flask(__name__)
CORS(app)

# /// MongoDB Connection ///
client = MongoClient("mongodb://localhost:27017/")
db = client["search_app"]
search_logs = db["search_logs"]

# /// Load and vectorize documents ///
DOC_FOLDER = "documents"
documents = []
filenames = []

# Read all .txt files
for file in os.listdir(DOC_FOLDER):
    if file.endswith(".txt"):
        with open(os.path.join(DOC_FOLDER, file), "r", encoding="utf-8") as f:
            documents.append(f.read())
            filenames.append(file)

# Create TF-IDF vectors
vectorizer = TfidfVectorizer(stop_words="english")
doc_vectors = vectorizer.fit_transform(documents)


# /// Search Route ///
@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    query = data.get("query", "")

    if not query:
        return jsonify({"error": "No query provided."}), 400

    start = time.time()

    # Vectorize query
    query_vector = vectorizer.transform([query])

    # Compute cosine similarity
    similarity_scores = cosine_similarity(query_vector, doc_vectors).flatten()

    boosted_results = []

    for i in range(len(similarity_scores)):
        score = float(similarity_scores[i])
        content = documents[i]

        # Boost if exact phrase is present
        if query.lower() in content.lower():
            score += 0.05

        boosted_results.append((filenames[i], score))

    # Sort by boosted score, descending
    ranked_results = sorted(boosted_results, key=lambda x: x[1], reverse=True)

    # Return only the top 5 matches (if score > 0)
    results = [
        {"document": name, "score": score, "queryTerms": query.split()}
        for name, score in ranked_results
        if score > 0
    ][:5]

    search_duration = time.time() - start

    analysis = {
        "query": query,
        "query_length": len(query.split()),
        "total_documents_matched": len([s for _, s in boosted_results if s > 0]),
        "highest_score": ranked_results[0][1] if ranked_results else 0,
        "exact_phrase_found_in": sum(
            1 for doc in documents if query.lower() in doc.lower()
        ),
        "search_duration": search_duration,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "top_results": [
            {"document": r["document"], "score": r["score"]} for r in results
        ],
    }

    # Store the search analysis in MongoDB
    search_logs.insert_one(analysis)

    return jsonify({"results": results, "analysis": analysis})


# /// Fetch Full Document ///
@app.route("/document/<filename>", methods=["GET"])
def get_document(filename):
    try:
        with open(os.path.join(DOC_FOLDER, filename), "r", encoding="utf-8") as f:
            content = f.read()
        return jsonify({"filename": filename, "content": content})
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404


# /// Fetch Search History ///
@app.route("/search-history", methods=["GET"])
def search_history():
    history = list(search_logs.find({}, {"_id": 0}).sort("timestamp", -1))
    return jsonify({"history": history})


if __name__ == "__main__":
    app.run(debug=True)
