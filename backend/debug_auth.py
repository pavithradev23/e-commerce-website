import json
import hashlib
import sys

def hash_password(password):
    """Same hash function as in app.py"""
    return hashlib.sha256(password.encode()).hexdigest()

def diagnose():
    print("🔍 DIAGNOSING AUTHENTICATION ISSUE")
    print("=" * 60)
  
    try:
        with open('users.json', 'r') as f:
            users = json.load(f)
        print(f"✅ users.json loaded successfully")
        print(f"   Contains {len(users)} user(s)")
        
    
        admin_users = [u for u in users if u.get('email') == 'admin@gmail.com']
        if admin_users:
            admin = admin_users[0]
            print(f"\n👤 ADMIN USER FOUND:")
            print(f"   Name: {admin.get('name')}")
            print(f"   Email: {admin.get('email')}")
            print(f"   Role: {admin.get('role')}")
            print(f"   Password hash in DB: {admin.get('password')}")
            
            expected_hash = hash_password('admin123')
            print(f"   Expected hash for 'admin123': {expected_hash}")
            print(f"   Hashes match: {admin.get('password') == expected_hash}")
            
            if admin.get('password') != expected_hash:
                print(f"\n❌ PASSWORD HASH MISMATCH!")
                print(f"   This means either:")
                print(f"   1. The password in DB is not 'admin123'")
                print(f"   2. The hashing algorithm changed")
                print(f"   3. The user was created with a different password")
                
                test_passwords = ['admin123', 'Admin123', 'ADMIN123', 'admin', 'admin@123']
                print(f"\n🔑 Testing common password variations:")
                for pwd in test_passwords:
                    test_hash = hash_password(pwd)
                    matches = test_hash == admin.get('password')
                    print(f"   '{pwd}' -> {test_hash} {'✅ MATCHES!' if matches else ''}")
        else:
            print(f"\n❌ No admin user found in users.json!")
            
    except FileNotFoundError:
        print(f"❌ users.json file not found!")
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing users.json: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    
    print("\n" + "=" * 60)
    print("💡 SOLUTION: If password hashes don't match:")
    print("1. Delete users.json and restart Flask to recreate defaults")
    print("2. OR manually update the password hash in users.json")
    print("=" * 60)

if __name__ == "__main__":
    diagnose()