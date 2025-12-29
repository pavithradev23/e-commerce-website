import os
import json
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

try:
    client = genai.Client()
    print("✅ Gemini client initialized")
except Exception as e:
    print(f"⚠️ Gemini client error (will use fallback): {e}")
    client = None

FAKESTORE_API = "https://fakestoreapi.com"

def detect_greeting_or_general(message):
    """Detect if message is a greeting or general question"""
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
    """Extract rating/star value from query"""
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
    """Extract search intent from user query"""
    print(f"🔍 Analyzing query: '{user_query}'")

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
            print(f"✅ Gemini extracted: {gemini_intent}")
            
        except Exception as e:
            print(f"⚠️ Gemini extraction failed: {str(e)[:100]}")
 
    if not intent.get('keywords') or intent.get('category') is None:
        print("🔄 Using manual extraction...")
        
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
    
    print(f"📋 Final intent: {intent}")
    return intent

def detect_colors_in_text(text):
    """Detect all colors mentioned in a text"""
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
    """Check if product matches requested color"""
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
    """Search FakeStoreAPI based on user intent with proper color handling"""
    print(f"🔎 Searching with intent: {intent}")
    if min_rating:
        print(f"⭐ Minimum rating filter: {min_rating}")

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
        print(f"📁 Filtering by category: {user_category}")
    
    try:
        response = requests.get(api_url, timeout=10)
        all_products = response.json()
        print(f"📦 Total products from API: {len(all_products)}")
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
            print(f"✅ Found {len(exact_color_matches)} exact {user_color} matches")
        elif other_products and user_color:
            other_products.sort(key=lambda x: x.get('match_score', 0), reverse=True)
            final_products = other_products[:6]
            print(f"⚠️ No exact {user_color} matches, showing {len(final_products)} other products")
        elif other_products:
            other_products.sort(key=lambda x: x.get('match_score', 0), reverse=True)
            final_products = other_products[:6]
        

        for product in final_products:
            product['metadata'] = metadata
        
        return final_products
        
    except Exception as e:
        print(f"❌ FakeStoreAPI error: {e}")
        return []

def generate_ai_response(user_message, products_found, user_color=None, min_rating=None, metadata=None):
    """Generate AI response with context and helpful fallback messages"""
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
def chat():
    """Main chat endpoint"""
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        
        print(f"\n" + "="*50)
        print(f"💬 NEW MESSAGE: '{user_message}'")
        
        message_type = detect_greeting_or_general(user_message)
        if message_type == 'greeting':
            responses = [
                f"👋 {user_message.capitalize()}! I'm your shopping assistant.",
                f"Hello! 👋 I'm here to help you find products.",
                f"Hi there! Ready to help you shop.",
                f"{user_message.capitalize()}! Ask me for electronics, clothing, jewelry, or search for specific items!"
            ]
            import random
            return jsonify({
                'success': True,
                'reply': random.choice(responses),
                'products': [],
                'query_type': 'greeting'
            })
        
        elif message_type == 'general':
            responses = [
                "I'm doing great, thanks for asking! How can I help you find products today?",
                "I'm here and ready to help! What are you looking for?",
                "All systems go! What products can I help you find?",
                "I'm your shopping assistant - ready to help you discover awesome products!"
            ]
            import random
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
        
        print(f"📤 Sending: {len(formatted_products)} products")
        if intent.get('color'):
            print(f"🎨 Color requested: {intent.get('color')}")
            print(f"✅ Exact color matches: {len([p for p in formatted_products if p['exact_color_match']])}")
        if min_rating:
            print(f"⭐ Rating filter: ≥{min_rating}")
        print("="*50)
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"❌ Chat endpoint error: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'reply': "Sorry, I'm having technical difficulties. Please try again.",
            'products': []
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'shopping-assistant'})

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1')