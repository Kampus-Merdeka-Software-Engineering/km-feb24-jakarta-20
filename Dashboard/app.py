from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Allowing all origins for simplicity; adjust for security as needed.

# Load data from JSON file
with open('.\Dashboard\data.json', 'r') as f:
    data = json.load(f)

@app.route('/data', methods=['GET'])
def get_data():
    # Get parameters from the request
    draw = int(request.args.get('draw', 1))
    start = int(request.args.get('start', 0))
    length = int(request.args.get('length', 10))
    search_value = request.args.get('search[value]', '')
    order_column = int(request.args.get('order[0][column]', 0))
    order_dir = request.args.get('order[0][dir]', 'asc')

    # Column names to sort by
    column_names = ["transaction_id", "transaction_date", "transaction_time", "transaction_qty", "store_id", "store_location", "product_id", "unit_price", "product_category", "product_type", "product_detail"]
    order_by = column_names[order_column]

    # Filter data based on search value
    filtered_data = [item for item in data if search_value.lower() in json.dumps(item).lower()]

    # Sort data
    filtered_data.sort(key=lambda x: x[order_by], reverse=(order_dir == 'desc'))

    # Paginate data
    paginated_data = filtered_data[start:start + length]

    # Create response object
    response = {
        "draw": draw,
        "recordsTotal": len(data),
        "recordsFiltered": len(filtered_data),
        "data": paginated_data
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)