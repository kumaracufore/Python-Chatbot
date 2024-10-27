from flask import Flask, render_template, request, jsonify
import logging
import re

app = Flask(__name__, template_folder="templates")

logging.basicConfig(level=logging.DEBUG)


def strip_html_tags(text):
    return re.sub(r"<[^>]*>", "", text)


def print_input_message(messageText):
    clean_message = strip_html_tags(messageText)
    print(f"Input Message: {clean_message}")


@app.route("/")
def home():
    try:
        return render_template("index3.html")
    except Exception as e:
        app.logger.error(f"An error occurred while rendering the page: {str(e)}")
        return f"An error occurred while rendering the page: {str(e)}", 500


@app.route("/send_message", methods=["POST"])
def send_message():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data received"}), 400
        message = data.get("message", "")
        input = data.get("input", "")
        if not message:
            return jsonify({"error": "No message found in the data"}), 400

        print("Input message:", input)

        # Return the original message with HTML intact
        response = {"response": message}

        # Print a clean version of the response for console logging
        print(f"Response: {strip_html_tags(response['response'])}")

        return jsonify(response), 200
    except Exception as e:
        app.logger.error(f"Error in send_message route: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=Flase,host='0.0.0.0')
