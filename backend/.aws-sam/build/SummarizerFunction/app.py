import os
import json
import uuid
import boto3
import nltk
nltk.download('punkt', quiet=True)
nltk.download("punkt_tab", quiet=True)
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer

dynamodb = boto3.resource("dynamodb")
TABLE_NAME = os.environ.get("TABLE_NAME", "summaries")
table = dynamodb.Table(TABLE_NAME)

def summarize_text(text: str, num_sentences: int = 3) -> str:
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LexRankSummarizer()
    summary_sentences = summarizer(parser.document, num_sentences)
    return " ".join(str(s) for s in summary_sentences)

def lambda_handler(event, context):
    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        body = {}

    text = body.get("text")
    num_sentences = int(body.get("num_sentences", 3))

    if not text:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Missing 'text' in request body."})
        }

    summary = summarize_text(text, num_sentences)
    item = {
        "id": str(uuid.uuid4()),
        "text": text[:4000],
        "summary": summary,
    }

    table.put_item(Item=item)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({"id": item["id"], "summary": summary})
    }
