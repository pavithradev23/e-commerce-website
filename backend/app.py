import os
import json
import re
import requests
import hashlib
import uuid
from datetime import timedelta, datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, 
    jwt_required, get_jwt_identity, get_jwt
)
from google import genai
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET', 'ecommerce-demo-secret-key-2024-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
jwt = JWTManager(app)

USERS_FILE = 'users.json'

def load_users():
    try:
        with open(USERS_FILE,'r') as f:
            users=json.load(f)

        fixed = False  # ✅ FIXED: Initialize variable
        for user in users:
            if user['email']!='admin@gmail.com' and user['role']=='admin':
                user['role']='user'
                print(f"Security fix:Downgraded {user['email']} from admin to user")
                fixed=True

        if fixed:
            save_users(users)  # ✅ FIXED: Pass 'users' not 'user'

        return users  # ✅ FIXED: Proper indentation
         
    except FileNotFoundError:
        default_users = [
            {
                'id': str(uuid.uuid4()),
                'name': 'Admin User',
                'email': 'admin@gmail.com',
                'password': hash_password('admin123'),
                'role': 'admin',
                'created_at': datetime.utcnow().isoformat(),
                'last_login': None
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'John Doe',
                'email': 'user@gmail.com',
                'password': hash_password('user123'),
                'role': 'user',
                'created_at': datetime.utcnow().isoformat(),
                'last_login': None
            }
        ]
        save_users(default_users)
        return default_users
    except Exception as e:
        print(f"Error loading users: {e}")
        return []

def save_users(users):
    try:
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving users: {e}")
        return False

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def find_user_by_email(email):
    users = load_users()
    return next((user for user in users if user['email'] == email), None)

def update_user_last_login(user_id):
    users = load_users()
    for user in users:
        if user['id'] == user_id:
            user['last_login'] = datetime.utcnow().isoformat()
            save_users(users)
            break

try:
    client = genai.Client()
except Exception as e:
    client = None

FAKESTORE_API = "https://fakestoreapi.com"

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False,'error': f'{field} is required'}), 400
        if 'role' in data:
            data.pop('role')

        
        original_role = request.json.get('role') if request.json else None
        if original_role and original_role.lower() == 'admin':
            print(f"🚨 SECURITY ALERT: Attempt to register as admin from IP: {request.remote_addr}")
            print(f"    Email: {data.get('email')}")
        existing_user = find_user_by_email(data['email'])
        if existing_user:
            return jsonify({'success': False,'error': 'Email already registered'}), 400
        
        new_user = {
            'id': str(uuid.uuid4()),
            'name': data['name'],
            'email': data['email'],
            'password': hash_password(data['password']),
            'role': 'user',
            'created_at': datetime.utcnow().isoformat(),
            'last_login': datetime.utcnow().isoformat()
        }
        
        users = load_users()
        users.append(new_user)
        save_users(users)
        
        access_token = create_access_token(
            identity=new_user['id'],
            additional_claims={
                'role': new_user['role'],
                'email': new_user['email'],
                'name': new_user['name']
            }
        )
        
        user_response = {
            'id': new_user['id'],
            'name': new_user['name'],
            'email': new_user['email'],
            'role': new_user['role'],
            'created_at': new_user['created_at']
        }
        
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'token': access_token,
            'user': user_response
        })
        
    except Exception as e:
        return jsonify({'success': False,'error': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'success': False,'error': 'Email and password are required'}), 400
        
        user = find_user_by_email(data['email'])
        if not user:
            return jsonify({'success': False,'error': 'Invalid email or password'}), 401
        
        hashed_input = hash_password(data['password'])
        if user['password'] != hashed_input:
            return jsonify({'success': False,'error': 'Invalid email or password'}), 401
        
        update_user_last_login(user['id'])
        
        access_token = create_access_token(
            identity=user['id'],
            additional_claims={
                'role': user['role'],
                'email': user['email'],
                'name': user['name']
            }
        )
        
        user_response = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'created_at': user['created_at'],
            'last_login': user['last_login']
        }
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': access_token,
            'user': user_response
        })
        
    except Exception as e:
        return jsonify({'success': False,'error': 'Login failed'}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        claims = get_jwt()
        user_id = get_jwt_identity()
        
        user = find_user_by_email(claims.get('email'))
        if not user:
            return jsonify({'success': False,'error': 'User not found'}), 404
        
        user_response = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'created_at': user['created_at'],
            'last_login': user['last_login']
        }
        
        return jsonify({'success': True,'user': user_response})
        
    except Exception as e:
        return jsonify({'success': False,'error': 'Failed to get user'}), 500

@app.route('/api/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'success': True,'message': 'Logout successful'})

@app.route('/api/auth/validate', methods=['POST'])
def validate_token():
    try:
        data = request.json
        token = data.get('token')   
        if not token:
            return jsonify({'valid': False}), 400
        
        if token and len(token.split('.')) == 3:
            return jsonify({'valid': True})
        else:
            return jsonify({'valid': False})
    except:
        return jsonify({'valid': False})

@app.route('/api/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    try:
        claims = get_jwt()
        
        if claims.get('role') != 'admin':
            return jsonify({'success': False,'error': 'Admin access required'}), 403
        
        users = load_users()
        safe_users = []
        for user in users:
            safe_user = {k: v for k, v in user.items() if k != 'password'}
            safe_users.append(safe_user)
        
        return jsonify({
            'success': True,
            'users': safe_users,
            'count': len(safe_users)
        })
        
    except Exception as e:
        return jsonify({'success': False,'error': 'Failed to get users'}), 500

@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    try:
        claims = get_jwt()
        
        if claims.get('role') != 'admin':
            return jsonify({'success': False,'error': 'Admin access required'}), 403
        
        users = load_users()
        total_users = len(users)
        admin_users = len([u for u in users if u['role'] == 'admin'])
        regular_users = total_users - admin_users
        recent_users = 0
        week_ago = datetime.utcnow() - timedelta(days=7)
        
        for user in users:
            if user.get('created_at'):
                created = datetime.fromisoformat(user['created_at'].replace('Z', '+00:00'))
                if created > week_ago:
                    recent_users += 1
        
        return jsonify({
            'success': True,
            'stats': {
                'total_users': total_users,
                'admin_users': admin_users,
                'regular_users': regular_users,
                'recent_users': recent_users,
                'active_today': 0,
                'total_orders': 0
            }
        })
        
    except Exception as e:
        return jsonify({'success': False,'error': 'Failed to get statistics'}), 500

@app.route('/api/admin/products', methods=['GET'])
@jwt_required()
def get_admin_products():
    try:
        claims = get_jwt()
        
        if claims.get('role') != 'admin':
            return jsonify({'success': False,'error': 'Admin access required'}), 403
        
        response = requests.get(f"{FAKESTORE_API}/products")
        products = response.json()
        
        return jsonify({
            'success': True,
            'products': products,
            'count': len(products)
        })
        
    except Exception as e:
        return jsonify({'success': False,'error': 'Failed to fetch products'}), 500

@app.route('/api/search',methods=['GET'])
def search_products():
    search_query=request.args.get('q','').lower()
    response=requests.get('https://fakestoreapi.com/products')
    products= response.json()
   
    filtered=[]
    for prod in products:
        if search_query in prod['title'].lower():
            filtered.append(prod) 
    return jsonify(filtered)  # ✅ FIXED: Return outside the loop

def detect_greeting_or_general(message):
    message_lower = message.lower().strip()
    
    greetings = [
        'hi', 'hello', 'hey', 'hii', 'hiii', 'hello there', 'hi there',
        'good morning', 'good afternoon', 'good evening', 'gm', 'gn'
    ]
    
    general_questions = [
        'how are you', "what's up", 'how do you do', 'sup',
        'are you there', 'can you hear me', 'who are you',
        'what can you do', 'help', 'what is your name'
    ]
    
    if any(message_lower == greet or message_lower.startswith(greet + ' ') for greet in greetings):
        return 'greeting'
    
    if any(question in message_lower for question in general_questions):
        return 'general'
    
    return None

def extract_rating_from_query(query):
    patterns = [
        r'(\d+(?:\.\d+)?)\s*stars?',
        r'(\d+(?:\.\d+)?)\s*ratings?',
        r'rating\s*of\s*(\d+(?:\.\d+)?)',
        r'rated\s*(\d+(?:\.\d+)?)',
        r'(\d+(?:\.\d+)?)\s*star',
        r'(\d+(?:\.\d+)?)/5'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, query.lower())
        if match:
            try:
                rating = float(match.group(1))
                return min(max(rating, 1), 5)  
            except:
                pass
    return None

def extract_product_intent(user_query):
    intent = {
        "user_message": user_query,
        "keywords": [],
        "category": None,
        "color": None
    }
    
    if client:
        try:
            prompt = f"""Analyze this shopping query: "{user_query}"      
            Extract as JSON:
            1. category (electronics, jewelery, men's clothing, women's clothing, or null)
            2. color (if mentioned: red, blue, green, black, white, gold, silver, etc.)
            3. keywords (main product keywords, as array)
            
            Return ONLY valid JSON.
            Example: {{"category": "electronics", "color": "blue", "keywords": ["phone", "samsung"]}}
            
            If it's NOT a shopping query, return: {{"category": null, "color": null, "keywords": []}}
            
            JSON:"""
            
            response = client.models.generate_content(
                model="gemini-2.5-flash-lite",
                contents=prompt
            )
            
            gemini_intent = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
            intent.update(gemini_intent)
            
        except Exception as e:
            pass
 
    if not intent.get('keywords') or intent.get('category') is None:
        words = user_query.lower().split()
        category_keywords = {
            'electronics': ['electronics', 'phone', 'laptop', 'tablet', 'computer', 'tv', 'headphone', 'earphone', 'charger'],
            'jewelery': ['jewelry', 'jewellery', 'ring', 'necklace', 'bracelet', 'gold', 'silver', 'diamond', 'gem'],
            "men's clothing": ["men's", 'men', 'shirt', 't-shirt', 'pants', 'jeans', 'jacket', 'hoodie', 'sweater'],
            "women's clothing": ["women's", 'women', 'dress', 'skirt', 'blouse', 'bra', 'handbag', 'purse', 'heels']
        }
        
        colors = {
            'red': ['red', 'rose', 'ruby', 'crimson', 'scarlet'],
            'blue': ['blue', 'navy', 'azure', 'sky', 'cobalt'],
            'green': ['green', 'emerald', 'forest', 'lime', 'olive'],
            'black': ['black', 'dark', 'onyx', 'ebony', 'charcoal'],
            'white': ['white', 'light', 'ivory', 'cream', 'pearl'],
            'yellow': ['yellow', 'gold', 'golden', 'amber', 'lemon'],
            'pink': ['pink', 'rose', 'fuchsia', 'magenta', 'coral'],
            'purple': ['purple', 'violet', 'lavender', 'lilac', 'plum']
        }

        found_keywords = []
        found_category = None
        found_color = None
        
        for word in words:
            word_clean = word.strip('.,!?')
            
            for color_name, color_words in colors.items():
                if word_clean in color_words and not found_color:
                    found_color = color_name
                    break
            
            if not found_category:
                for category, keywords in category_keywords.items():
                    if word_clean in keywords:
                        found_category = category
                        break
            
            common_words = ['the', 'and', 'for', 'you', 'me', 'show', 'want', 'need', 
                          'looking', 'with', 'have', 'has', 'this', 'that', 'these', 'those']
            if len(word_clean) > 2 and word_clean not in common_words:
                found_keywords.append(word_clean)
        
        if found_category:
            intent['category'] = found_category
        if found_color:
            intent['color'] = found_color
        if found_keywords:
            intent['keywords'] = found_keywords
    
    return intent

def detect_colors_in_text(text):
    colors = {
        'red': ['red', 'rose', 'ruby', 'crimson', 'scarlet', 'burgundy', 'maroon', 'cherry'],
        'blue': ['blue', 'navy', 'azure', 'sky', 'cobalt', 'indigo', 'teal', 'turquoise'],
        'green': ['green', 'emerald', 'forest', 'lime', 'olive', 'mint', 'sage', 'jade'],
        'black': ['black', 'dark', 'onyx', 'ebony', 'charcoal', 'midnight', 'jet'],
        'white': ['white', 'light', 'ivory', 'cream', 'snow', 'pearl', 'alabaster'],
        'yellow': ['yellow', 'gold', 'golden', 'amber', 'mustard', 'lemon', 'sunflower'],
        'pink': ['pink', 'rose', 'fuchsia', 'magenta', 'coral', 'salmon', 'blush'],
        'purple': ['purple', 'violet', 'lavender', 'lilac', 'plum', 'mauve', 'orchid']
    }
    
    detected_colors = set()
    text_lower = text.lower()
    
    for color_name, color_words in colors.items():
        if any(f' {word} ' in f' {text_lower} ' for word in color_words):
            detected_colors.add(color_name)
    
    return detected_colors

def check_color_match(title, description, requested_color):
    colors_dict = {
        'red': ['red', 'rose', 'ruby', 'crimson', 'scarlet', 'burgundy', 'maroon'],
        'blue': ['blue', 'navy', 'azure', 'sky', 'cobalt', 'indigo'],
        'green': ['green', 'emerald', 'forest', 'lime', 'olive', 'mint'],
        'black': ['black', 'dark', 'onyx', 'ebony', 'charcoal'],
        'white': ['white', 'light', 'ivory', 'cream', 'snow'],
        'yellow': ['yellow', 'gold', 'golden', 'amber', 'mustard'],
        'pink': ['pink', 'rose', 'fuchsia', 'magenta', 'coral'],
        'purple': ['purple', 'violet', 'lavender', 'lilac', 'plum']
    }
    
    if requested_color not in colors_dict:
        return False
    
    text = f"{title} {description}".lower()
    return any(word in text for word in colors_dict[requested_color])

def search_fakestore_products(intent, min_rating=None):
    category_map = {
        "electronics": "electronics",
        "jewelery": "jewelery",
        "men's clothing": "men's clothing",
        "women's clothing": "women's clothing"
    }
    
    user_category = intent.get('category')
    user_color = intent.get('color')
    keywords = intent.get('keywords', [])
    
    rating_keywords = ['rating', 'ratings', 'star', 'stars', 'rated']
    keywords = [k for k in keywords if k not in rating_keywords]
    
    api_url = f"{FAKESTORE_API}/products"
    if user_category and user_category in category_map:
        api_url = f"{FAKESTORE_API}/products/category/{category_map[user_category]}"
    
    try:
        response = requests.get(api_url, timeout=10)
        all_products = response.json()
        available_colors_set = set()
        
        exact_color_matches = []  
        other_products = []       
        color_detected_in_any = False 
        
        for product in all_products:
            product_title = product['title'].lower()
            product_desc = product.get('description', '').lower()
            product_rating = product.get('rating', {}).get('rate', 0)
            
            if min_rating and product_rating < min_rating:
                continue
            
            product_colors = detect_colors_in_text(f"{product_title} {product_desc}")
            available_colors_set.update(product_colors)
            
            has_exact_color_match = False
            if user_color:
                has_exact_color_match = check_color_match(product_title, product_desc, user_color)
                color_detected_in_any = color_detected_in_any or has_exact_color_match
            
            match_score = 0
            if keywords:
                keyword_match = any(keyword.lower() in product_title or 
                                   keyword.lower() in product_desc
                                   for keyword in keywords if keyword and len(keyword) > 2)
                if keyword_match:
                    match_score += 3
            
            if has_exact_color_match:
                match_score += 5  
                product['color_detected'] = user_color
                product['has_color_match'] = True
            elif user_color:
                match_score -= 2  
            
            if product_rating >= 4.5:
                match_score += 1
            
            product['match_score'] = match_score
            if has_exact_color_match:
                exact_color_matches.append(product)
            elif match_score > 0 or (not keywords and not user_color):
                other_products.append(product)
        
        available_colors = sorted(list(available_colors_set))
        
        final_products = []
        metadata = {
            'exact_color_found': False,
            'available_colors': available_colors,
            'color_detected_in_any': color_detected_in_any
        }
        
        if exact_color_matches:
            exact_color_matches.sort(key=lambda x: x.get('match_score', 0), reverse=True)
            final_products = exact_color_matches[:6]
            metadata['exact_color_found'] = True
        elif other_products and user_color:
            other_products.sort(key=lambda x: x.get('match_score', 0), reverse=True)
            final_products = other_products[:6]
        elif other_products:
            other_products.sort(key=lambda x: x.get('match_score', 0), reverse=True)
            final_products = other_products[:6]
        
        for product in final_products:
            product['metadata'] = metadata
        
        return final_products
        
    except Exception as e:
        return []

def generate_ai_response(user_message, products_found, user_color=None, min_rating=None, metadata=None):
    if not products_found:
        if min_rating:
            return f"I couldn't find products with {min_rating}+ star ratings. Try with a lower rating or different search terms."
        elif user_color:
            return f"I couldn't find {user_color} products. Try searching without color specification."
        else:
            return "I couldn't find products matching your request. Try: 'electronics', 'clothing', or 'jewelry'."
    
    meta = metadata or products_found[0].get('metadata', {}) if products_found else {}
    
    exact_color_found = meta.get('exact_color_found', False)
    available_colors = meta.get('available_colors', [])
    
    exact_color_products = [p for p in products_found if p.get('has_color_match', False)]
    
    if user_color and not exact_color_found:
        available_colors_str = ", ".join(available_colors) if available_colors else "various other colors"
        
        if min_rating:
            return f"❌ Sorry, no {user_color} products with {min_rating}+ stars found.\n\n✅ However, I found {len(products_found)} products in {available_colors_str} with {min_rating}+ stars that might interest you!"
        else:
            return f"❌ Sorry, we don't have {user_color} products available right now.\n\n✅ However, we do have products in these colors: {available_colors_str}.\n\nWould you like to see products in one of these colors instead?"
    
    if user_color and exact_color_products:
        if min_rating:
            return f"✅ I found {len(exact_color_products)} {user_color} products with {min_rating}+ star ratings!"
        else:
            return f"✅ I found {len(exact_color_products)} {user_color} products for you!"
    
    if min_rating:
        return f"✅ I found {len(products_found)} products with {min_rating}+ star ratings!"
    else:
        return f"✅ I found {len(products_found)} matching products for you!"

@app.route('/chat', methods=['POST'])
@jwt_required(optional=True)
def chat():
    try:
        user_info = "Guest"
        try:
            claims = get_jwt()
            if claims:
                user_info = f"{claims.get('name', 'User')} ({claims.get('email', 'Unknown')})"
        except:
            pass
        
        data = request.json
        user_message = data.get('message', '').strip()
        
        message_type = detect_greeting_or_general(user_message)
        if message_type == 'greeting':
            import random
            responses = [
                f"👋 {user_message.capitalize()}! I'm your shopping assistant.",
                f"Hello! 👋 I'm here to help you find products.",
                f"Hi there! Ready to help you shop.",
                f"{user_message.capitalize()}! Ask me for electronics, clothing, jewelry, or search for specific items!"
            ]
            return jsonify({
                'success': True,
                'reply': random.choice(responses),
                'products': [],
                'query_type': 'greeting'
            })
        
        elif message_type == 'general':
            import random
            responses = [
                "I'm doing great, thanks for asking! How can I help you find products today?",
                "I'm here and ready to help! What are you looking for?",
                "All systems go! What products can I help you find?",
                "I'm your shopping assistant - ready to help you discover awesome products!"
            ]
            return jsonify({
                'success': True,
                'reply': random.choice(responses),
                'products': [],
                'query_type': 'general'
            })
        
        min_rating = extract_rating_from_query(user_message)
        intent = extract_product_intent(user_message)
        
        products = []
        if intent.get('category') or (intent.get('keywords') and len(intent['keywords']) > 0):
            products = search_fakestore_products(intent, min_rating)
        
        metadata = products[0].get('metadata', {}) if products else {}
        ai_response = generate_ai_response(
            user_message, 
            products, 
            intent.get('color'), 
            min_rating,
            metadata
        )
        
        formatted_products = []
        for product in products:
            rating = product.get('rating', {}).get('rate', 0)
            color_detected = product.get('color_detected')   
            formatted_products.append({
                'id': product['id'],
                'name': product['title'],
                'price': f"${product['price']}",
                'image': product['image'],
                'url': f"/product/{product['id']}",
                'category': product['category'],
                'rating': f"{rating:.1f}/5",
                'color': color_detected if color_detected else 'Various',
                'match_score': product.get('match_score', 0),
                'description': product.get('description', '')[:60] + "...",
                'exact_color_match': product.get('has_color_match', False),
                'metadata': product.get('metadata', {})
            })
        
        response_data = {
            'success': True,
            'reply': ai_response,
            'products': formatted_products,
            'query_type': 'shopping',
            'filters': {
                'color_requested': intent.get('color'),
                'min_rating': min_rating
            },
            'metadata': metadata
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'reply': "Sorry, I'm having technical difficulties. Please try again.",
            'products': []
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy', 
        'service': 'shopping-assistant',
        'features': ['chatbot', 'authentication', 'admin-dashboard'],
        'jwt_enabled': True
    })

if __name__ == '__main__':
    load_users()
    app.run(debug=True, port=5000, host='127.0.0.1')