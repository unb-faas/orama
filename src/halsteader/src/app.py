from flask import Flask, request, jsonify
from flask_cors import CORS
from pygments.lexers import guess_lexer
from pygments.util import ClassNotFound
import tempfile, subprocess, os, json
from pygments.lexers import get_all_lexers


ext_map = {}

for lexer in get_all_lexers():
    name = lexer[0].lower()  # nome principal do lexer
    aliases = lexer[1] if len(lexer) > 1 else []
    filenames = lexer[2] if len(lexer) > 2 else []

    # tenta extrair uma extensão (ex: "*.py" → ".py")
    ext = None
    for f in filenames:
        if f.startswith("*."):
            ext = f[1:]  # remove o "*"
            break

    # define a extensão padrão, se existir
    if ext:
        ext_map[name] = ext
        # opcional: também mapear aliases
        for alias in aliases:
            ext_map[alias.lower()] = ext

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 300 * 1024 * 1024  # 200 MB
CORS(app)  # Enable CORS for all origins


@app.route('/analyze', methods=['POST'])
def analyze_code():
    data = request.get_json()
    code = data.get("code", "")

    if not code or not isinstance(code, str):
        return jsonify({"error": "Invalid input. Provide a valid code string."}), 400

    try:
        # Try to guess the programming language
        try:
            lexer = guess_lexer(code)
            app.logger.info(lexer)
            language = lexer.name.lower()
        except ClassNotFound:
            language = "unknown"

        app.logger.info(language)
        # Choose file extension based on language
        
        ext = ext_map.get(language, ".txt")

        # Save temporary file with submitted code
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext, mode="w") as tmp:
            tmp.write(code)
            tmp_path = tmp.name

        # Run multimetric CLI command (no --quiet / --format)
        cmd = ["multimetric", tmp_path]
        result = subprocess.run(cmd, capture_output=True, text=True)

        # Remove temp file
        os.unlink(tmp_path)

        if result.returncode != 0:
            return jsonify({
                "error": "Multimetric failed to analyze the code.",
                "details": result.stderr
            }), 500

        # Parse JSON output
        try:
            output = json.loads(result.stdout)
        except json.JSONDecodeError:
            return jsonify({
                "error": "Could not parse multimetric output.",
                "raw_output": result.stdout
            }), 500

        metrics = next(iter(output.values()), {})
        file_key = list(metrics.keys())[0]
        metric = metrics[file_key]

        app.logger.info(metric)

        response = {
            # Halstead metrics
            "language": metric['lang'][0],
            "lexer": language,
            "total_operands": metric['operands_sum'],
            "distinct_operands": metric['operands_uniq'],
            "total_operators": metric['operators_sum'],
            "distinct_operators": metric['operators_uniq'],
            "time": metric['halstead_timerequired'],
            "bugs": metric['halstead_bugprop'],
            "effort": metric['halstead_effort'],
            "volume": metric['halstead_volume'],
            "difficulty": metric['halstead_difficulty'],
            "vocabulary": metric['operands_uniq'] + metric['operators_uniq'],
            "length": len(code),
            # Other metrics
            "maintainability_index": metric['maintainability_index'],
            "tiobe_compiler": metric['tiobe_compiler'],
            "tiobe_complexity": metric['tiobe_complexity'],
            "tiobe_coverage": metric['tiobe_coverage'],
            "tiobe_duplication": metric['tiobe_duplication'],
            "tiobe_fanout": metric['tiobe_fanout'],
            "tiobe_functional": metric['tiobe_functional'],
            "tiobe_security": metric['tiobe_security'],
            "tiobe_standard": metric['tiobe_standard'],
            "tiobe": metric['tiobe']

        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health_check():
    """Simple health check endpoint."""
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000)
