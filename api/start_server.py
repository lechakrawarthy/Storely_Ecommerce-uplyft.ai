#!/usr/bin/env python3
"""
Start the refactored Flask API server
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def start_server():
    """Start the Flask server"""
    try:
        print("🚀 Starting Storely E-commerce API (Refactored)")
        print("=" * 50)

        # Import and create the app
        from app_final import create_app
        app = create_app()

        print("✅ Flask app created successfully")
        print("📡 Starting server on http://127.0.0.1:5000")
        print("💡 Health check: http://127.0.0.1:5000/health")
        print("🔐 Auth endpoints: http://127.0.0.1:5000/api/auth/*")
        print("🛍️  Products endpoints: http://127.0.0.1:5000/api/products")
        print("💬 Chat endpoints: http://127.0.0.1:5000/api/chat/*")
        print("-" * 50)

        # Start the server
        app.run(
            host='127.0.0.1',
            port=5000,
            debug=True,
            use_reloader=False  # Disable reloader to avoid double startup
        )

    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    start_server()
