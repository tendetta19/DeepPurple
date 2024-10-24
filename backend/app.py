# backend/app.py

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import PyPDF2
from openai import AzureOpenAI
from werkzeug.utils import secure_filename
import docx
import openpyxl
import json

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

# Initialize Azure OpenAI client
client = AzureOpenAI(
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
    api_key=AZURE_OPENAI_KEY,
    api_version="2024-05-01-preview",
)

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'xlsx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

tools = [
    {
        "type": "function",
        "function": {
            "name": "identify_emotion_and_sentiments",
            "description": "Analyze the following text for sentiment and emotions. Take into account the context",
            "parameters": {
                "type": "object",
                "properties": {
                    "primary_emotion": {
                        "type": "string",
                        "description": "The primary emotion detected from the text. Must start with a capital letter",
                    }, 
                    "primary_emotion_reason": {
                        "type": "string",
                        "description": "The reason on how the primary emotion is determined.",
                    },
                    "secondary_emotion": {
                        "type": "string",
                        "description": "The secondary emotion detected from the text. Must start with a capital letter",
                    }, 
                    "secondary_emotion_reason": {
                        "type": "string",
                        "description": "The secondary on how the primary emotion is determined.",
                    }, 
                    "summary": {
                        "type": "string",
                        "description": "The summary on the text based on the emotions and sentiments.",
                    }, 
                    "key_takeaways": {
                        "type": "string",
                        "description": "The key take aways on what should be done based on the generated analysis.",
                    },
                },
                "required": ["primary_emotion", "primary_emotion_reason", "secondary_emotion", "secondary_emotion_reason", "summary", "key_takeaways"]
            },
        },
    }]


def allowed_file(filename):
    """Check if the file has one of the allowed extensions."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_stream):
    """Extract text from a PDF file."""
    try:
        reader = PyPDF2.PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def extract_text_from_docx(file_stream):
    """Extract text from a DOCX file."""
    try:
        doc = docx.Document(file_stream)
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return '\n'.join(full_text)
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return ""

def extract_text_from_xlsx(file_stream):
    """Extract text from an XLSX file."""
    try:
        wb = openpyxl.load_workbook(file_stream, data_only=True)
        sheet = wb.active
        full_text = []
        for row in sheet.iter_rows(values_only=True):
            row_text = ' '.join([str(cell) if cell is not None else '' for cell in row])
            full_text.append(row_text)
        return '\n'.join(full_text)
    except Exception as e:
        print(f"Error extracting XLSX: {e}")
        return ""

def analyze_sentiment_emotion(text):
    """Analyze sentiment and emotion from text."""
    try:
        prompt = (
            "Analyze the following text for sentiment and emotions. "
            "Identify the primary and secondary key emotions, highlighting the relevant portions that indicate these emotions. "
            "Provide a summary and key takeaways on actions that should be taken based on the context of the text.\n\n"
            f"Text: {text}"
        )
        print("Prompt:", prompt)

        response = client.chat.completions.create(
            model=AZURE_OPENAI_DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": "You are an AI assistant that analyzes text for sentiment and emotions."},
                {"role": "user", "content": prompt}
            ],
            tools = tools,
            tool_choice = "auto",
        )
        response_message = response.choices[0].message 
        print(response_message)
        analysis = ""
        # Check if tool_calls are present
        tool_calls = getattr(response_message, 'tool_calls', None)
        print(tool_calls)

        if tool_calls:
            for tool_call in tool_calls:
                function_args = json.loads(tool_call.function.arguments)
                print(function_args)
                function_name = tool_call.function.name

                if function_name == "identify_emotion_and_sentiments":
                    print("Identify emotions and sentiments called, formmating the analysis")
                    primary_emotion = function_args.get("primary_emotion")
                    primary_emotion_reason = function_args.get("primary_emotion_reason")
                    secondary_emotion = function_args.get("secondary_emotion")
                    secondary_emotion_reason = function_args.get("secondary_emotion_reason")
                    summary = function_args.get("summary")
                    key_takeaways = function_args.get("key_takeaways")

                    analysis = (
                        f"**Primary Emotion:** {primary_emotion}\n\n"
                        f"**Reason for Primary Emotion:** {primary_emotion_reason}\n\n"
                        f"**Secondary Emotion:** {secondary_emotion}\n\n"
                        f"**Reason for Secondary Emotion:** {secondary_emotion_reason}\n\n"
                        f"**Summary:**\n\n{summary}\n\n"
                        f"**Key Takeaways:**\n\n{key_takeaways}\n"
                    )
        else:
            analysis = response.choices[0].message.content.strip()
        return analysis
    except Exception as e:
        print(f"Error with OpenAI API: {e}")
        return "Error analyzing text."

@app.route('/api/analyze', methods=['POST'])
def analyze():
    if 'file' in request.files:
        file = request.files['file']
        if file.filename.endswith('.pdf'):
            text = extract_text_from_pdf(file)
        elif file.filename.endswith(('.txt', '.md')):
            text = file.read().decode('utf-8')
        else:
            return jsonify({"error": "Unsupported file type"}), 400
    elif 'text' in request.form:
        text = request.form['text']
    else:
        return jsonify({"error": "No text or file provided"}), 400

    if not text.strip():
        return jsonify({"error": "Empty text"}), 400

    analysis = analyze_sentiment_emotion(text)
    print(analysis)
    return jsonify({"analysis": analysis})

@app.route('/api/analyze-files', methods=['POST'])
def analyze_files():
    if 'files' not in request.files:
        return jsonify({'error': 'No files part in the request.'}), 400

    files = request.files.getlist('files')
    if not files:
        return jsonify({'error': 'No files selected for uploading.'}), 400

    results = "" 

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            results += f"\n\n### Filename: {filename} \n\n"

            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            try:
                if filename.endswith('.pdf'):
                    # Re-open the file for reading
                    with open(filepath, 'rb') as f:
                        text = extract_text_from_pdf(f)

                elif filename.endswith(('.txt', '.md')):
                    try:
                        with open(filepath, 'r', encoding='utf-8') as f:
                            text = f.read()
                        print(f"Content of {filename}:\n{text}")  # Enhanced debug statement
                    except Exception as e:
                        print(f"Error reading file {filename}: {e}")
                        results.append({
                            'filename': filename,
                            'error': f'Error reading file: {str(e)}'
                        })
                        continue
                elif filename.endswith('.docx'):
                    with open(filepath, 'rb') as f:
                        text = extract_text_from_docx(f)
                elif filename.endswith('.xlsx'):
                    with open(filepath, 'rb') as f:
                        text = extract_text_from_xlsx(f)
                else:
                    results.append({
                        'filename': filename,
                        'error': 'Unsupported file type.'
                    })
                    continue

                if not text.strip():
                    results.append({
                        'filename': filename,
                        'error': 'Empty text extracted from the file.'
                    })
                    continue

                analysis = analyze_sentiment_emotion(text)
                results += analysis 
            except Exception as e:
                # Handle any exceptions during file processing
                results.append({
                    'filename': filename,
                    'error': f'Error processing file: {str(e)}'
                })
            finally:
                # Optionally, delete the file after processing to save space
                if os.path.exists(filepath):
                    os.remove(filepath)
        else:
            results += analysis 
    print(results)
    return jsonify({'analysis': results}), 200

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'Backend is running.'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
