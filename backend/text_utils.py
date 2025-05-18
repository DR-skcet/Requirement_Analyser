import nltk
nltk.download('punkt')
from nltk.tokenize import sent_tokenize

def chunk_text(text, max_tokens=500):
    """
    Split text into chunks of approx max_tokens (words, not exact tokens)
    """
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = []

    current_length = 0
    for sentence in sentences:
        sentence_length = len(sentence.split())
        if current_length + sentence_length > max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = [sentence]
            current_length = sentence_length
        else:
            current_chunk.append(sentence)
            current_length += sentence_length

    # Add last chunk
    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
