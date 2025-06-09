#!/usr/bin/env python3
"""
Simple HTTP test to check if server is responsive
"""
import time
import subprocess
import sys
import os
import requests
from threading import Thread


def start_server_background():
    """Start server in background"""
    print("🚀 Starting server in background...")

    # Start the server
    process = subprocess.Popen(
        [sys.executable, "app_final.py"],
        cwd=os.path.dirname(os.path.abspath(__file__)),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    return process


def test_server():
    """Test if server is responsive"""
    server_process = None

    try:
        # Start server
        server_process = start_server_background()

        # Wait for server to start
        print("⏳ Waiting 5 seconds for server to start...")
        time.sleep(5)

        # Test if server is running
        base_url = "http://127.0.0.1:5000"

        print(f"🔍 Testing server at {base_url}")

        # Test health endpoint
        try:
            response = requests.get(f"{base_url}/health", timeout=5)
            print(f"Health check: {response.status_code}")
            if response.status_code == 200:
                print(f"✅ Health check passed: {response.json()}")
            else:
                print(f"⚠ Health check returned: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Health check failed: {e}")

        # Test products endpoint
        try:
            response = requests.get(f"{base_url}/api/products", timeout=5)
            print(f"Products endpoint: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(
                    f"✅ Products endpoint working: {len(data.get('data', []))} products")
            else:
                print(f"⚠ Products endpoint returned: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Products endpoint failed: {e}")

        # Test auth register endpoint
        try:
            test_user = {
                "email": "test@example.com",
                "password": "test123",
                "name": "Test User"
            }
            response = requests.post(f"{base_url}/api/auth/register",
                                     json=test_user, timeout=5)
            print(f"Register endpoint: {response.status_code}")
            if response.status_code in [200, 201]:
                print("✅ Register endpoint working")
            elif response.status_code == 400:
                print(
                    "⚠ Register endpoint returned 400 (might be validation or user exists)")
            else:
                print(f"⚠ Register endpoint returned: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Register endpoint failed: {e}")

    except Exception as e:
        print(f"❌ Test failed: {e}")

    finally:
        # Clean up server process
        if server_process:
            print("🛑 Stopping server...")
            server_process.terminate()
            try:
                server_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server_process.kill()
            print("Server stopped")


if __name__ == "__main__":
    test_server()
